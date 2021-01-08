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

const checkStep = (state) => {
  if (!state.mode && state.step > STEP_MODE) {
    state.mode = STEP_MODE;
  }
  if (!state.selectedPhoto && state.step > STEP_PHOTOS) {
    state.step = STEP_PHOTOS;
  }
  return state;
};

const reducer = (state, action) => {
  if (action.type === MERGE) {
    return checkStep({
      ...state,
      ...action.state,
    });
  }
};

const STEP_UPLOAD = "10_upload";
const STEP_MODE = "20_mode";
const STEP_PHOTOS = "30_photos";
const STEP_SETTINGS = "40_settings";
const STEP_PAYMENT = "50_payment";
const STEP_PRINT = "60_print";

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    mode: "",
    step: "10_upload",
    selectedPhoto: null,
    amount: 1,
    quality: "Normale Qualität",
    format: "A6",
  });

  const steps = [
    [STEP_UPLOAD, "USB einstecken", <StepUpload dispatch={dispatch} />],
    [STEP_MODE, "Modus", <StepMode state={state} dispatch={dispatch} />],
    [
      STEP_PHOTOS,
      "Photo auswählen",
      <StepPhotos
        select={(id) => {
          dispatch({
            type: MERGE,
            state: {
              selectedPhoto: id,
              step: STEP_SETTINGS,
            },
          });
        }}
      />,
    ],
    [
      STEP_SETTINGS,
      "Druck konfigurieren",
      <StepSettings state={state} dispatch={dispatch} />,
    ],
    [
      STEP_PAYMENT,
      "Bezahlung",
      <StepPayment state={state} dispatch={dispatch} />,
    ],
    [STEP_PRINT, "Druck", <StepPrint state={state} dispatch={dispatch} />],
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

function StepUpload({ dispatch }) {
  return (
    <div
      className="step step--upload"
      onClick={() => dispatch({ type: MERGE, state: { step: STEP_MODE } })}
    >
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

function StepMode({ state, dispatch }) {
  const single = <Photo id={99} />;
  return (
    <div className="step step--mode">
      <h1>Modus auswählen</h1>
      <div className="modes">
        <figure
          className="modes__mode"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: { mode: "single", step: STEP_PHOTOS },
            })
          }
        >
          <Photo id={99} />
          <figcaption>Ein Bild mehrmals drucken</figcaption>
        </figure>
        <figure
          className="modes__mode"
          onClick={() => alert("Du hast den Prototyp verlassen")}
        >
          <Photo id={99} />
          <figcaption>Verschiedene Bilder je einmal drucken</figcaption>
        </figure>
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

        <hr />
        <button
          className="button"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: { step: STEP_PAYMENT },
            })
          }
        >
          Einstellungen bestätigen
        </button>
      </div>
    </div>
  );
}

function StepPayment({ state, dispatch }) {
  return (
    <div className="step step--payment">
      <div className="step__header">
        <h1>Bezahlung</h1>
      </div>
      <p>
        Format: {state.format}
        <br />
        Qualität: {state.quality}
        <br />
        Seitenanzahl: {state.amount}
      </p>
      <p>
        Zu bezahlen: CHF {(Math.floor(Math.random() * 100000) / 100).toFixed(2)}
      </p>
      <button
        className="button"
        onClick={() =>
          dispatch({
            type: MERGE,
            state: { step: STEP_PRINT },
          })
        }
      >
        Ich habe bezahlt (demo only)
      </button>
    </div>
  );
}

function StepPrint({ state, dispatch }) {
  return (
    <div className="step step--print">
      <div className="step__header">
        <h1>Druck</h1>
      </div>
      <progress max="100" value="70">
        70%
      </progress>
      14/20 Bilder gedruckt.
    </div>
  );
}
