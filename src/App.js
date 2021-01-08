import { useState } from "react";

import "./App.css";

// const Photo = () => <img src={"https://picsum.photos/600/400"} alt="" />;
let photoId = 1;
const Photo = () => (
  <div
    className="photo"
    style={{
      backgroundImage: `url(https://picsum.photos/id/${++photoId}/600/400)`,
    }}
  />
);

export default function App() {
  const [step, setStep] = useState("upload");

  return (
    <div className="App">
      <nav className="steps">
        <a
          href="#"
          onClick={() => setStep("upload")}
          className="steps__step steps__step--active"
        >
          Upload
        </a>
        <a href="#" onClick={() => setStep("photos")} className="steps__step">
          Select photos
        </a>
        <a href="#" onClick={() => setStep("upload")} className="steps__step">
          Configure print
        </a>
        <a href="#" onClick={() => setStep("upload")} className="steps__step">
          Payment
        </a>
        <a href="#" onClick={() => setStep("upload")} className="steps__step">
          Printing
        </a>
      </nav>

      {step === "upload" ? (
        <StepUpload />
      ) : step === "photos" ? (
        <StepPhotos />
      ) : (
        "Unknown step"
      )}
    </div>
  );
}

function StepUpload() {
  return (
    <div className="step step--upload">
      <h1>Bitte USB Stick einstecken</h1>
      <Photo />
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
  const [photos] = useState(() =>
    Array(40)
      .fill()
      .map(() => <Photo />)
  );

  const selections = [1, 2, 3, 5];

  return (
    <div className="step step--photos">
      <div className="step__header">
        <h1>Photo auswählen</h1>
        <div className="buttongroup">
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
            {photo}
          </div>
        ))}
      </div>
    </div>
  );
}
