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
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

type Item = { id: string; countryName: string };
type State = { items: Item[]; userName: string; postSucceeded: boolean };

const getCountries = (): Item[] =>
  countries.map((countryName, index) => ({ id: `item-${index}`, countryName }));

class DndVoting extends Component<any, State> {
  constructor(props: Object) {
    super(props);
    this.state = {
      items: getCountries(),
      userName: "",
      postSucceeded: false
    };
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
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { userName, items } = this.state;
    return (
      <div>
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
                      const flag = `flags/${nameToCountryCode[
                        item.countryName
                      ].toLowerCase()}.png`;
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <img
                            src={flag}
                            className="flag"
                            alt={`Flag of ${item.countryName}`}
                          />
                          {item.countryName}{" "}
                          <span>{pointsInOrder[index] || ""}</span>
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
        {this.state.postSucceeded ? (
          <div>Sendte inn!</div>
        ) : (
          <React.Fragment>
            <div className="nes-field">
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
              onClick={async () => {
                const votes: { [point: number]: string } = pointsInOrder.reduce(
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
              Send inn
            </button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default DndVoting;
