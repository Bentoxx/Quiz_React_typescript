import React, { useState } from 'react';
import { fetchQuestionsQuiz } from './API';
//components
import QuestionCard from './components/QuestionCard';
//types
import { QuestionState,Difficulty } from './API';
//styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}

const TOTAL_QUESTIONS = 10

const App = () =>{
  const [loading, setLoading] = useState(false)
  const[questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswer, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)


  const startTrivia = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuestionsQuiz(TOTAL_QUESTIONS, Difficulty.EASY)

    setQuestions(newQuestions)
    setScore(0)
    setUserAnswers([])
    setNumber(0)
    setLoading(false)

  }

  const checktAnswer = (e: React.MouseEvent<HTMLButtonElement>)=>{
    if(!gameOver){
      //users answer
      const answer = e.currentTarget.value
      //check answer against correct answer
      const correct = questions[number].correct_answer === answer
      //add score if answer is correct
      if (correct ) setScore(prev => prev + 1)
      //save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(prev => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    //move on to the next question if not the last question
    const nextQuestion = number + 1

    if (nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true)
    }else{
      setNumber(nextQuestion)
    }
  }
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswer.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className='Score'>Score: {score}</p> : null}
        {loading && <p>Loading Questions...</p>}
        {!loading && !gameOver &&(
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswer ? userAnswer[number] : undefined}
            callback={checktAnswer}
          />
        )}
        {!gameOver && !loading && userAnswer.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
