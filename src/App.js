import { useEffect, useReducer, useState } from "react";

import "./App.css";

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
  .map((_, idx) => idx + 100);

const MERGE = "MERGE";

const checkStep = (state) => {
  if (!state.mode && state.step > STEP_MODE) {
    state.step = STEP_MODE;
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

const STEP_HELLO = "00_hello";
const STEP_UPLOAD = "10_upload";
const STEP_MODE = "20_mode";
const STEP_PHOTOS = "30_photos";
const STEP_SETTINGS = "40_settings";
const STEP_PAYMENT = "50_payment";
const STEP_PRINT = "60_print";
const STEP_THANKS = "70_thanks";

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    mode: "",
    step: STEP_HELLO,
    selectedPhoto: null,
    amount: 1,
    quality: "Normale Qualität",
    format: "A6",
    columns: 3,
  });

  const args = { state, dispatch };
  const steps = [
    [STEP_HELLO, "", <StepHello {...args} />],
    [
      STEP_UPLOAD,
      <i className="material-icons">cloud_upload</i>,
      <StepUpload {...args} />,
    ],
    [
      STEP_MODE,
      <div>
        <i className="material-icons">navigate_before</i>
        <i className="material-icons">navigate_next</i>
      </div>,
      <StepMode {...args} />,
    ],
    [
      STEP_PHOTOS,
      <i className="material-icons">camera_roll</i>,
      <StepPhotos {...args} />,
    ],
    [
      STEP_SETTINGS,
      <i className="material-icons">settings</i>,
      <StepSettings {...args} />,
    ],
    [
      STEP_PAYMENT,
      <i className="material-icons">payment</i>,
      <StepPayment {...args} />,
    ],
    [
      STEP_PRINT,
      <i className="material-icons">print</i>,
      <StepPrint {...args} />,
    ],
    [STEP_THANKS, "", <StepThanks {...args} />],
  ];

  const step = steps.find((s) => (s[0] === state.step ? s[2] : null));

  return (
    <div className={`App ${step[1] ? "App--has-nav" : ""}`}>
      {step[1] ? <Menu steps={steps} {...args} /> : null}
      {step[2] || "Unknown step"}
    </div>
  );
}

function Menu({ steps, state, dispatch }) {
  return (
    <nav className="steps">
      {steps.map(([key, title]) =>
        title ? (
          <a
            key={key}
            href="#"
            className={`steps__step ${
              key === state.step
                ? "steps__step--active"
                : key >= state.step
                ? "steps__step--disabled"
                : ""
            }`}
            onClick={() => dispatch({ type: MERGE, state: { step: key } })}
          >
            {title}
          </a>
        ) : null
      )}
    </nav>
  );
}

function StepHello({ state, dispatch }) {
  return (
    <div className="step step--hello">
      <div className="step__header">
        <h1>Photo Print Pro</h1>
        <span>v7.2</span>
      </div>
      <div className="step__content">
        <Photo id={98} className="photo photo--small" />
        <div className="buttons">
          <a
            href="#"
            className="button"
            onClick={() => alert("Du hast den Prototyp verlassen")}
          >
            EN
          </a>
          <a
            href="#"
            className="button"
            onClick={() =>
              dispatch({ type: MERGE, state: { step: STEP_UPLOAD } })
            }
          >
            DE
          </a>
          <a
            href="#"
            className="button"
            onClick={() => alert("Du hast den Prototyp verlassen")}
          >
            FR
          </a>
          <a
            href="#"
            className="button"
            onClick={() => alert("Du hast den Prototyp verlassen")}
          >
            IT
          </a>
        </div>
      </div>
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

function StepPhotos({ state, dispatch }) {
  const selections = [1, 2, 3, 5];

  return (
    <div className="step step--photos">
      <div className="step__header">
        <h1>Photo auswählen</h1>
        <div className="buttons buttons--group buttons--small">
          <div className="buttons__caption">Zoom:</div>
          {selections.map((columns) => (
            <button
              className={`button ${
                columns === state.columns ? "button--active" : ""
              }`}
              onClick={() => dispatch({ type: MERGE, state: { columns } })}
            >
              {columns}
            </button>
          ))}
        </div>
      </div>
      <div className="photos" style={{ "--columns": state.columns }}>
        {photos.map((photo) => (
          <a
            href="#"
            key={photo}
            className="photos__photo"
            onClick={() =>
              dispatch({
                type: MERGE,
                state: {
                  step: STEP_SETTINGS,
                  selectedPhoto: photo,
                },
              })
            }
          >
            <Photo id={photo} />
          </a>
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
          {formats.map((format) => (
            <button
              className={`button ${
                format === state.format ? "button--active" : ""
              }`}
              onClick={() => dispatch({ type: MERGE, state: { format } })}
            >
              {format}
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
  const [printed, setPrinted] = useState(0);
  useEffect(() => {
    if (printed < state.amount) {
      setTimeout(() => {
        setPrinted((printed) => printed + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        dispatch({ type: MERGE, state: { step: STEP_THANKS } });
      }, 2000);
    }
  });

  return (
    <div className="step step--print">
      <div className="step__header">
        <h1>Druck</h1>
      </div>
      <progress max={state.amount} value={printed}>
        {Math.floor((100 * printed) / state.amount)}%
      </progress>
      {printed}/{state.amount} Bilder gedruckt.
    </div>
  );
}

function StepThanks({ state, dispatch }) {
  return (
    <div className="step step--thanks">
      <div className="step__header">
        <h1>Herzlichen Dank für Deinen Auftrag!</h1>
      </div>

      <button
        className="button"
        onClick={() =>
          dispatch({
            type: MERGE,
            state: { step: STEP_MODE },
          })
        }
      >
        Neuen Auftrag starten
      </button>
    </div>
  );
}
