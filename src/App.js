import { useReducer, useState } from "react";

import "./App.css";

// const Photo = () => <img src={"https://picsum.photos/600/400"} alt="" />;
let photoId = 1;
const Photo = ({ id }) => (
  <div
    className="photo"
    style={{
      backgroundImage: `url(https://picsum.photos/id/${id}/600/400)`,
    }}
  />
);

const photos = Array(40)
  .fill()
  .map((_, idx) => idx + 1);

const MERGE = "MERGE";

const reducer = (state, action) => {
  if (action.type === MERGE) {
    return {
      ...state,
      ...action.state,
    };
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    step: "upload",
    selectedPhoto: null,
    amount: 1,
    quality: "Normale Qualität",
    format: "A6",
  });

  const steps = [
    ["upload", "USB einstecken", <StepUpload />],
    [
      "photos",
      "Photos auswählen",
      <StepPhotos
        select={(id) => {
          dispatch({
            type: MERGE,
            state: {
              selectedPhoto: id,
              step: "settings",
            },
          });
        }}
      />,
    ],
    [
      "settings",
      "Druck konfigurieren",
      <StepSettings state={state} dispatch={dispatch} />,
    ],
    ["payment", "Bezahlung", null],
    ["printing", "Druck", null],
  ];

  const s = steps.find((s) => (s[0] === state.step ? s[2] : null));
  const component = s ? s[2] : "Unknown step";

  return (
    <div className="App">
      <nav className="steps">
        {steps.map(([key, title]) => (
          <a
            key={key}
            href="#"
            className={`steps__step ${
              key === state.step ? "steps__step--active" : ""
            }`}
            onClick={() => dispatch({ type: MERGE, state: { step: key } })}
          >
            {title}
          </a>
        ))}
      </nav>

      {component}
    </div>
  );
}

function StepUpload() {
  return (
    <div className="step step--upload">
      <h1>Bitte USB Stick einstecken</h1>
      <Photo id={1} />
      <div className="buttons">
        <a href="#" className="button">
          EN
        </a>
        <a href="#" className="button button--active">
          DE
        </a>
        <a href="#" className="button">
          FR
        </a>
        <a href="#" className="button">
          IT
        </a>
      </div>
    </div>
  );
}

function StepPhotos({ select }) {
  const [columns, setColumns] = useState(3);
  const selections = [1, 2, 3, 5];

  return (
    <div className="step step--photos">
      <div className="step__header">
        <h1>Photo auswählen</h1>
        <div className="buttons buttons--group buttons--small">
          <div className="buttons__caption">Zoom:</div>
          {selections.map((c) => (
            <button
              className={`button ${c === columns ? "button--active" : ""}`}
              onClick={() => setColumns(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="photos" style={{ "--columns": columns }}>
        {photos.map((photo, idx) => (
          <div
            key={idx}
            className="photos__photo"
            onClick={() => select(photo)}
          >
            <Photo id={photo} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepSettings({ state, dispatch }) {
  const formats = ["A2", "A3", "A4", "A5", "A6"];
  const qualities = ["Normale Qualität", "Profiqualität"];

  return (
    <div className="step step--settings">
      <div className="step__header">
        <h1>Druckeinstellungen</h1>
      </div>
      <div className="selected-photo">
        <Photo id={state.selectedPhoto} />
      </div>
      <div className="settings-table">
        <label htmlFor="settings-format">Format</label>
        <div className="buttons buttons--small">
          {formats.map((f) => (
            <button
              className={`button ${f === state.format ? "button--active" : ""}`}
              onClick={() => dispatch({ type: MERGE, state: { format: f } })}
            >
              {f}
            </button>
          ))}
        </div>

        <label htmlFor="settings-quality">Quality</label>
        <div className="buttons buttons--small">
          {qualities.map((f) => (
            <button
              className={`button ${
                f === state.quality ? "button--active" : ""
              }`}
              onClick={() => dispatch({ type: MERGE, state: { quality: f } })}
            >
              {f}
            </button>
          ))}
        </div>

        <label htmlFor="settings-amount">Menge</label>
        <button
          className="button"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: { amount: Math.max(1, state.amount - 1) },
            })
          }
        >
          -
        </button>
        <input type="text" disabled value={state.amount} />
        <button
          className="button"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: { amount: Math.min(99, state.amount + 1) },
            })
          }
        >
          +
        </button>
        <button
          className="button"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: { amount: Math.min(99, state.amount + 10) },
            })
          }
        >
          +10
        </button>
      </div>
    </div>
  );
}
