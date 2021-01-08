import ReactDOM from "react-dom";
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
  proQuality: false,
  format: "A6",
  columns: 3,
};

const prints = (state) => {
  if (state.mode === MODE_SINGLE) {
    return state.amount;
  } else if (state.mode === MODE_MULTIPLE) {
    return state.selectedPhoto.length;
  } else {
    return -1;
  }
};

const PER_PAGE = { A2: 22, A3: 14, A4: 8, A5: 4, A6: 2 };
const PRO_MULTIPLIER = 1.2;
const price = (state) =>
  PER_PAGE[state.format] *
  (state.proQuality ? PRO_MULTIPLIER : 1) *
  prints(state);

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

const _multipleSettings = {
  mode: "multiple",
  step: "40_settings",
  selectedPhoto: [100, 101, 102, 107],
  amount: 1,
  proQuality: false,
  format: "A6",
  columns: 3,
};
const _singleSettings = {
  mode: "single",
  step: "40_settings",
  selectedPhoto: 100,
  amount: 5,
  proQuality: false,
  format: "A6",
  columns: 3,
};

const _overwritten = null;

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

function Hardware({ children }) {
  return ReactDOM.createPortal(
    <div className="hardware">
      <strong>Hardware</strong>
      {children}
    </div>,
    document.body
  );
}

function StepHello({ state, dispatch }) {
  return (
    <div className="step step--hello">
      <div className="step__content">
        <h1>Photo Print Pro</h1>
        <p>
          Drucken Sie Ihre Lieblingsfotos in Profi- oder Standard-Qualität um
          Erinnerungen zu bewahren von Grossformat bis Postkartengrösse aus.
        </p>
        <Photo id={98} />
        <p>Bitte wählen Sie Ihre Sprache</p>
        <div className="buttons languages">
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
    <div className="step step--upload">
      <div className="step__content">
        <h1>Bilder einlesen</h1>
        <p>
          Schliessen Sie Ihr Speichermedium an einem der dafür vorgesehenen
          Steckplätze an, um die Bilder zu laden.
        </p>
        <Hardware>
          <button
            className="button"
            onClick={() =>
              dispatch({ type: MERGE, state: { step: STEP_MODE } })
            }
          >
            USB Stick ist eingesteckt
          </button>
        </Hardware>
      </div>
    </div>
  );
}

function StepMode({ state, dispatch }) {
  const single = <Photo id={99} />;
  return (
    <div className="step step--mode">
      <div className="step__content">
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
        <h1>
          {state.mode === MODE_SINGLE
            ? "Wählen Sie das Bild aus, das Sie ausdrucken wollen"
            : "Wählen Sie die Bilder aus, die Sie jeweils einmal ausdrucken wollen"}
        </h1>
        <div className="buttons buttons--group buttons--small">
          <div className="buttons__caption">Pro&nbsp;Zeile:</div>
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
  const qualities = [[false, "Standard"], [true, "Profi"]];

  const isSingle = state.mode === MODE_SINGLE;
  const isMultiple = state.mode === MODE_MULTIPLE;

  return (
    <div className="step step--settings">
      <div className="step__content">
        <h1>Bitte wähle aus folgenden Optionen</h1>
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
                  <div className="spinner">
                    <input
                      type="text"
                      disabled
                      value={state.selectedPhoto.length}
                    />
                  </div>
                ) : null}
              </td>
            </tr>
            <tr>
              <th>Qualität</th>
              <td>
                <div className="buttons">
                  {qualities.map(([flag, title]) => (
                    <button
                      className={`button ${
                        flag === state.proQuality ? "button--active" : ""
                      }`}
                      onClick={() =>
                        dispatch({ type: MERGE, state: { proQuality: flag }})
                      }
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <th>Gesamtpreis</th>
              <td>CHF {price(state).toFixed(2)}</td>
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
          <div
            className="photos"
            style={{ "--columns": state.selectedPhoto.length }}
          >
            {state.selectedPhoto.map((photo) => (
              <div className="photos__photo">
                <Photo key={photo} id={photo} />
              </div>
            ))}
          </div>
        ) : null}

        <button
          className="button button--back"
          onClick={() =>
            dispatch({
              type: MERGE,
              state: { step: STEP_PHOTOS },
            })
          }
        >
          Auswahl anpassen
        </button>
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
      <div className="step__content">
        <h1>Bezahlung</h1>
        <p>
          Format: {state.format}
          <br />
          Qualität: {state.proQuality ? "Profi": "Standard"}
          <br />
          Seitenanzahl: {prints(state)}
        </p>
        <p>Zu bezahlen: CHF {price(state).toFixed(2)}</p>
        <Hardware>
          <button
            className="button"
            onClick={() =>
              dispatch({ type: MERGE, state: { step: STEP_PRINT } })
            }
          >
            Betrag ist bezahlt
          </button>
        </Hardware>
      </div>
    </div>
  );
}

function StepPrint({ state, dispatch }) {
  const [printed, setPrinted] = useState(0);
  const amount = prints(state);

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
      <div className="step__content">
        <h1>Druck</h1>
        <progress max={amount} value={printed}>
          {Math.floor((100 * printed) / amount)}%
        </progress>
        {printed}/{amount} Bilder gedruckt.
      </div>
    </div>
  );
}

function StepThanks({ state, dispatch }) {
  return (
    <div className="step step--thanks">
      <div className="step__content">
        <h1>Herzlichen Dank für Ihren Auftrag!</h1>

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
    </div>
  );
}
