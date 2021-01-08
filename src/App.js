import { useState } from "react";

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

export default function App() {
  const [step, setStep] = useState("upload");

  const steps = [
    ["upload", "USB einstecken", <StepUpload />],
    ["photos", "Photos auswählen", <StepPhotos />],
    ["settings", "Druck konfigurieren", <StepSettings />],
    ["payment", "Bezahlung", null],
    ["printing", "Druck", null],
  ];

  const s = steps.find((s) => (s[0] === step ? s[2] : null));
  const component = s ? s[2] : "Unknown step";

  return (
    <div className="App">
      <nav className="steps">
        {steps.map(([key, title]) => (
          <a
            key={key}
            href="#"
            className={`steps__step ${
              key === step ? "steps__step--active" : ""
            }`}
            onClick={() => setStep(key)}
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

function StepPhotos() {
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
          <div key={idx} className="photos__photo">
            <Photo id={photo} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepSettings() {
  const formats = ["A2", "A3", "A4", "A5", "A6"];
  const [format, setFormat] = useState("A4");

  const qualities = ["Normale Qualität", "Profiqualität"];
  const [quality, setQuality] = useState("Normale Qualität");

  const [amount, setAmount] = useState(1);

  return (
    <div className="step step--settings">
      <div className="step__header">
        <h1>Druckeinstellungen</h1>
      </div>
      <div className="selected-photo">
        <Photo id={42} />
      </div>
      <div className="settings-table">
        <label htmlFor="settings-format">Format</label>
        <div className="buttons buttons--small">
          {formats.map((f) => (
            <button
              className={`button ${f === format ? "button--active" : ""}`}
              onClick={() => setFormat(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <label htmlFor="settings-quality">Quality</label>
        <div className="buttons buttons--small">
          {qualities.map((f) => (
            <button
              className={`button ${f === quality ? "button--active" : ""}`}
              onClick={() => setFormat(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <label htmlFor="settings-amount">Menge</label>
        <button
          className="button"
          onClick={() => setAmount(Math.max(1, amount - 1))}
        >
          -
        </button>
        <input type="text" disabled value={amount} />
        <button
          className="button"
          onClick={() => setAmount(Math.min(99, amount + 1))}
        >
          +
        </button>
        <button
          className="button"
          onClick={() => setAmount(Math.min(99, amount + 10))}
        >
          +10
        </button>
      </div>
    </div>
  );
}
