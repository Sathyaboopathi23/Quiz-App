import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get("https://sathyaboopathi.pythonanywhere.com/api/questions/")
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, []);

  const selectAnswer = (questionId, option) => {
    setSelected(option);
    setAnswers({ ...answers, [questionId]: option });
  };

  const nextQuestion = () => {
    setSelected(null);
    setCurrent(current + 1);
  };

  const submitQuiz = () => {
    axios.post("https://sathyaboopathi.pythonanywhere.com/api/submit-result/", {
      username: username,
      answers: answers
    }).then(res => {
      setResult(res.data);
    });
  };

  if (questions.length === 0) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  const q = questions[current];

  return (
    <div className="container mt-5">
      <h2 className="text-center">Quiz App</h2>

      {!result && (
        <>
          <input
            type="text"
            className="form-control mt-3"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="card p-4 mt-4">
            <h5>
              Question {current + 1} / {questions.length}
            </h5>
            <h4 className="mt-3">{q.question}</h4>

            {[q.option1, q.option2, q.option3, q.option4].map(opt => (
              <button
                key={opt}
                onClick={() => selectAnswer(q.id, opt)}
                className={`btn d-block w-100 mt-3 
                  ${selected === opt ? "btn-success" : "btn-outline-primary"}`}
                disabled={selected !== null}
              >
                {opt}
              </button>
            ))}
          </div>

          {selected && (
            current + 1 < questions.length ? (
              <button className="btn btn-warning mt-4" onClick={nextQuestion}>
                Next Question
              </button>
            ) : (
              <button className="btn btn-success mt-4" onClick={submitQuiz}>
                Submit Quiz
              </button>
            )
          )}
        </>
      )}

      {result && (
        <div className="alert alert-success mt-4 text-center">
          <h3>Quiz Completed 🎉</h3>
          <p>
            Score: <b>{result.score}</b> / {result.total_questions}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
