import { useEffect, useReducer, useState } from "react";

import "./App.css";

const photos = Array(40)
  .fill()
  .map((_, idx) => idx + 100);

const MERGE = "MERGE";

const STEP_HELLO = "00_hello";
const STEP_UPLOAD = "10_upload";
const STEP_MODE = "20_mode";
const STEP_PHOTOS = "30_photos";
const STEP_SETTINGS = "40_settings";
const STEP_PAYMENT = "50_payment";
const STEP_PRINT = "60_print";
const STEP_THANKS = "70_thanks";

const MODE_SINGLE = "single";
const MODE_MULTIPLE = "multiple";

const initialState = {
  mode: "",
  step: STEP_HELLO,
  selectedPhoto: null,
  amount: 1,
  quality: "Standard",
  format: "A6",
  columns: 3,
};

const checkStep = (reducer) => (state, action) => {
  state = reducer(state, action);

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
    return {
      ...state,
      ...action.state,
    };
  }
};

let _overwritten;
// _overwritten = {"mode":"multiple","step":"40_settings","selectedPhoto":[100,101,102],"amount":1,"quality":"Standard","format":"A6","columns":3}
_overwritten = {
  mode: "single",
  step: "40_settings",
  selectedPhoto: 100,
  amount: 5,
  quality: "Standard",
  format: "A6",
  columns: 3,
};

export default function App() {
  const [state, dispatch] = useReducer(
    checkStep(reducer),
    _overwritten || initialState
  );

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

  console.log(JSON.stringify(state));

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

function Photo({ id }) {
  return (
    <div
      className="photo"
      style={{
        backgroundImage: `url(https://picsum.photos/id/${id}/600/400)`,
      }}
    />
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
        <p>Bitte wählen Sie Ihre Sprache</p>
        <div className="buttons">
          <a
            href="#"
            className="language en"
            onClick={() => alert("Du hast den Prototyp verlassen")}
          ></a>
          <a
            href="#"
            className="language de"
            onClick={() =>
              dispatch({ type: MERGE, state: { step: STEP_UPLOAD } })
            }
          ></a>
          <a
            href="#"
            className="language fr"
            onClick={() => alert("Du hast den Prototyp verlassen")}
          ></a>
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
      <div className="step__header">
        <h1>Bitte USB Stick einstecken</h1>
      </div>
      <div className="step__content">
        <button className="button">Ist eingesteckt (debug only)</button>
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
              state: {
                mode: MODE_SINGLE,
                selectedPhoto: null,
                step: STEP_PHOTOS,
              },
            })
          }
        >
          <div className="pile">
            <Photo id={99} />
            <Photo id={99} />
            <Photo id={99} />
          </div>
          <figcaption>Ein Bild mehrmals drucken</figcaption>
        </figure>
        <figure
          className="modes__mode"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: {
                mode: MODE_MULTIPLE,
                selectedPhoto: [],
                step: STEP_PHOTOS,
              },
            })
          }
        >
          <div className="tiles">
            <Photo id={99} />
            <Photo id={98} />
            <Photo id={95} />
            <Photo id={96} />
          </div>
          <figcaption>Verschiedene Bilder je einmal drucken</figcaption>
        </figure>
      </div>
    </div>
  );
}

function StepPhotos({ state, dispatch }) {
  const selections = [1, 2, 3, 5];
  let listComponent;

  if (state.mode === MODE_SINGLE) {
    listComponent = <PhotosSingle state={state} dispatch={dispatch} />;
  } else if (state.mode === MODE_MULTIPLE) {
    listComponent = <PhotosMultiple state={state} dispatch={dispatch} />;
  }

  return (
    <div className="step step--photos">
      <div className="step__header">
        <h1>{state.mode === MODE_SINGLE ? "Photo auswählen" : "Photos auswählen"}</h1>
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
      {listComponent}
    </div>
  );
}

function PhotosSingle({ state, dispatch }) {
  return (
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
  );
}

const toggle = (selected, id) =>
  selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];

function PhotosMultiple({ state, dispatch }) {
  return (
    <>
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
                  selectedPhoto: toggle(state.selectedPhoto, photo),
                },
              })
            }
          >
            <Photo id={photo} />
            <input
              type="checkbox"
              checked={state.selectedPhoto.includes(photo)}
            />
          </a>
        ))}
      </div>
      <button
        className="button button--continue"
        disabled={!state.selectedPhoto.length}
        onClick={() =>
          dispatch({ type: MERGE, state: { step: STEP_SETTINGS } })
        }
      >
        Auswahl bestätigen
      </button>
    </>
  );
}

function StepSettings({ state, dispatch }) {
  const formats = [
    ["A6", "11 x 15 cm"],
    ["A5", "15 x 21 cm"],
    ["A4", "21 x 30 cm"],
    ["A3", "30 x 42 cm"],
    ["A2", "42 x 60 cm"],
  ];
  const qualities = ["Standard", "Profi"];

  const isSingle = state.mode === MODE_SINGLE;
  const isMultiple = state.mode === MODE_MULTIPLE;

  return (
    <div className="step step--settings">
      <div className="step__header">
        <h1>Bitte wähle aus folgenden Optionen</h1>
      </div>
      <div className="step__content">
        <div className="settings-table">
          <table>
            <tr>
              <th style={{ paddingTop: "2rem" }}>Format</th>
              <td>
                <div className="formats">
                  {formats.map(([format, size]) => (
                    <div className="formats__format">
                      <span>{size}</span>
                      <button
                        className={`button ${
                          format === state.format ? "button--active" : ""
                        }`}
                        onClick={() =>
                          dispatch({ type: MERGE, state: { format } })
                        }
                      >
                        {format}
                      </button>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <th>Menge</th>
              <td>
                {isSingle ? (
                  <div className="spinner">
                    <button
                      className="button"
                      onClick={() =>
                        dispatch({
                          type: MERGE,
                          state: { amount: Math.max(1, state.amount - 10) },
                        })
                      }
                    >
                      -10
                    </button>
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
                ) : null}
                {isMultiple ? (
                  <input
                    type="text"
                    disabled
                    value={state.selectedPhoto.length}
                  />
                ) : null}
              </td>
            </tr>
            <tr>
              <th>Qualität</th>
              <td>
                <div className="buttons">
                  {qualities.map((f) => (
                    <button
                      className={`button ${
                        f === state.quality ? "button--active" : ""
                      }`}
                      onClick={() =>
                        dispatch({ type: MERGE, state: { quality: f } })
                      }
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <th>Gesamtpreis</th>
              <td>CHF 394.00</td>
            </tr>

            {isSingle ? (
              <tr>
                <th>Voransicht</th>
                <td>
                  <div className="selected-photo">
                    <Photo id={state.selectedPhoto} />
                  </div>
                </td>
              </tr>
            ) : null}
          </table>
        </div>
        {isMultiple ? (
          <div className="photos" style={{ "--columns": 3 }}>
            {state.selectedPhoto.map((photo) => (
              <div className="photos__photo">
                <Photo key={photo} id={photo} />
              </div>
            ))}
          </div>
        ) : null}
        <button
          className="button button--continue"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: { step: STEP_PAYMENT },
            })
          }
        >
          Weiter
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
  const amount =
    state.mode === MODE_SINGLE ? state.amount : state.selectedPhoto.length;
  useEffect(() => {
    if (printed < amount) {
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
      <progress max={amount} value={printed}>
        {Math.floor((100 * printed) / amount)}%
      </progress>
      {printed}/{amount} Bilder gedruckt.
    </div>
  );
}

function StepThanks({ state, dispatch }) {
  return (
    <div className="step step--thanks">
      <div className="step__header">
        <h1>Herzlichen Dank für Ihren Auftrag!</h1>
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
