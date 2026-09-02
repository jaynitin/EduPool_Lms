// src/pages/Student/QuizGenerator.jsx
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import StudentSidebar from '../../components/StudentSidebar';
import { generateQuiz } from '../../utils/generateQuiz';
import {
  Sparkles, Loader2, CheckCircle2, XCircle, RotateCcw,
} from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(e) {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setQuestions(null);
    setAnswers({});
    setSubmitted(false);

    try {
      const qs = await generateQuiz({ topic, numQuestions, difficulty });
      setQuestions(qs);
    } catch (err) {
      setError(err.message || 'Something went wrong generating the quiz.');
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(qIndex, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  }

  function handleSubmitQuiz() {
    setSubmitted(true);
  }

  function handleReset() {
    setQuestions(null);
    setAnswers({});
    setSubmitted(false);
    setTopic('');
  }

  const score = questions
    ? questions.reduce((sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#F7F5F2] font-body flex flex-col">
      <Navbar active="For Student" />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar active="Quiz Generator" />

        <main className="flex-1 px-8 py-6 overflow-y-auto">

          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-quaternary" />
            <h1 className="font-display text-2xl text-primary">AI Quiz Generator</h1>
          </div>
          <p className="text-secondary/60 text-sm mb-6">
            Generate a practice quiz on any topic, powered by Gemini.
          </p>

          {!questions && (
            <form onSubmit={handleGenerate} className="bg-white rounded-xl border border-secondary/10 p-6 max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Topic</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Python loops, React hooks, DBMS normalization"
                  className="w-full rounded-lg border border-secondary/20 bg-white px-3.5 py-2.5 text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Questions</label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full rounded-lg border border-secondary/20 bg-white px-3.5 py-2.5 text-sm text-primary"
                  >
                    {[3, 5, 10].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-lg border border-secondary/20 bg-white px-3.5 py-2.5 text-sm text-primary"
                  >
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-quaternary/10 border border-quaternary/30 text-quaternary text-sm px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium py-3 rounded-lg hover:bg-secondary transition disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Generating quiz...</>
                ) : (
                  <><Sparkles size={16} /> Generate Quiz</>
                )}
              </button>
            </form>
          )}

          {questions && (
            <div className="max-w-2xl space-y-5">
              {submitted && (
                <div className="bg-white rounded-xl border border-secondary/10 p-5 flex items-center justify-between">
                  <div>
                    <p className="font-display text-2xl text-primary">{score}/{questions.length}</p>
                    <p className="text-sm text-secondary/60">Quiz complete on "{topic}"</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-sm font-medium border border-secondary/20 rounded-lg px-4 py-2 text-primary bg-white hover:bg-secondary/5 transition"
                  >
                    <RotateCcw size={14} /> New Quiz
                  </button>
                </div>
              )}

              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white rounded-xl border border-secondary/10 p-5">
                  <p className="text-sm font-semibold text-primary mb-3">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => {
                      const isSelected = answers[qIndex] === oIndex;
                      const isCorrect = oIndex === q.correctIndex;
                      let style = 'border-secondary/20 text-primary hover:bg-secondary/5';
                      if (submitted) {
                        if (isCorrect) style = 'border-tertiary bg-tertiary/10 text-primary';
                        else if (isSelected && !isCorrect) style = 'border-quaternary bg-quaternary/10 text-primary';
                      } else if (isSelected) {
                        style = 'border-tertiary bg-tertiary/10 text-primary';
                      }
                      return (
                        <button
                          key={oIndex}
                          onClick={() => selectAnswer(qIndex, oIndex)}
                          className={`w-full flex items-center justify-between text-left text-sm px-4 py-2.5 rounded-lg border transition ${style}`}
                        >
                          {option}
                          {submitted && isCorrect && <CheckCircle2 size={16} className="text-tertiary shrink-0" />}
                          {submitted && isSelected && !isCorrect && <XCircle size={16} className="text-quaternary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && q.explanation && (
                    <p className="text-xs text-secondary/60 mt-3 border-t border-secondary/10 pt-3">
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}

              {!submitted && (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length !== questions.length}
                  className="w-full bg-primary text-white text-sm font-medium py-3 rounded-lg hover:bg-secondary transition disabled:opacity-40"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}