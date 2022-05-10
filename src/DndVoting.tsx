import React, { Component, CSSProperties } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle
} from "react-beautiful-dnd";
import countries from "./participatingCountries";
import nameToCountryCode from "./nameToCountryCode";
import { db } from "./Firebase";

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const pointsInOrder = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | null | undefined
): CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "lightblue",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
  margin: "0 auto"
});

type Item = { id: string; countryName: string };
type State = { items: Item[]; userName: string; postSucceeded: boolean };

const getCountries = (): Item[] =>
  countries.map((countryName, index) => ({ id: `item-${index}`, countryName }));

class DndVoting extends Component<any, State> {
  constructor(props: Object) {
    super(props);
    const countriesAsTheyWouldAppearWhenFresh = getCountries();
    const defaultState = {
      items: countriesAsTheyWouldAppearWhenFresh,
      userName: "",
      postSucceeded: false
    };
    const localStorageContent = localStorage.getItem("lastState");
    const savedState = localStorageContent
      ? JSON.parse(localStorageContent)
      : defaultState;

    const areSameLength = defaultState.items.length === savedState.items.length;
    const containSameCountries =
      intersection(
        new Set(defaultState.items.map(({ countryName }) => countryName)),
        new Set(
          savedState.items.map(
            ({ countryName }: { countryName: string }) => countryName
          )
        )
      ).size === defaultState.items.length;
    const savedCountriesAreEqualToParticipatingCountries =
      areSameLength && containSameCountries;

    console.log("areSameLength", areSameLength);
    console.log("containSameCountries", containSameCountries);

    if (savedCountriesAreEqualToParticipatingCountries) {
      this.state = savedState;
    } else {
      this.state = defaultState;
    }
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });

    let key = "lastState";
    localStorage.setItem(key, JSON.stringify({ ...this.state, items }));
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { userName, items } = this.state;
    return (
      <div>
        <h1 style={{ margin: "1rem" }}>ESC hos Lene og Gunnar 2022</h1>
        <div style={{ textAlign: "left", margin: "1rem" }}>
          <p>
            Dra og slipp landene i rekkefølge. Du trenger ikke sortere de som
            ikke får poeng.
          </p>
          <p>Sveip til bunnen for å skrive inn kallenavn og sende inn poeng.</p>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided: DraggableProvided, snapshot) => {
                      return (
                        <div
                          style={{
                            marginBottom: `${grid * 2}px`
                          }}
                        >
                          <div
                            className="nes-container is-rounded"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div>
                              <img
                                src={`flags/${nameToCountryCode[
                                  item.countryName
                                ].toLowerCase()}.png`}
                                className="flag"
                                alt={`Flag of ${item.countryName}`}
                              />
                              {item.countryName}
                            </div>
                            {pointsInOrder[index] && (
                              <div
                                className="nes-container is-rounded"
                                style={{
                                  padding: "0.1rem",
                                  background: "#fff"
                                }}
                              >
                                {pointsInOrder[index]}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ margin: "1rem" }}>
          {this.state.postSucceeded ? (
            <div>Takk for dine svar!</div>
          ) : (
            <React.Fragment>
              <div className="nes-field" style={{ margin: "1rem" }}>
                <label>Navnet ditt</label>
                <input
                  value={this.state.userName}
                  onChange={e => this.setState({ userName: e.target.value })}
                  className="nes-input"
                  type="text"
                />
              </div>
              <button
                className={`nes-btn is-primary ${!userName && "is-disabled"}`}
                style={{ marginBottom: "8rem" }}
                onClick={async () => {
                  const votes: {
                    [point: number]: string;
                  } = pointsInOrder.reduce(
                    (accumulator, point, index) => ({
                      ...accumulator,
                      [point]: items[index].countryName
                    }),
                    {}
                  );
                  db.collection("user-votes")
                    .add({
                      userName,
                      votes
                    })
                    .then(docRef => {
                      console.log("Document written with ID: ", docRef.id);
                      this.setState({ postSucceeded: true });
                    })
                    .catch(error => {
                      console.error("Error adding document: ", error);
                    });
                }}
              >
                Send inn poeng
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  let _intersection = new Set<T>();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

export default DndVoting;
