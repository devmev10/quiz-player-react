import React from "react";
import Q from "./Q";
import uuid from "react-uuid";
import Confetti from 'react-confetti'


export default function App() {
	// Set variable(state) named quiz to hold the question and answers array of objects
	const [quiz, setQuiz] = React.useState([]);
	const [answers, setAnswers] = React.useState({});
    const [showCorrectAns, setShowCorrectAns] = React.useState('')
    const [isActive, setIsActive] = React.useState(false)
    const [result, setResult] = React.useState('')
    const [quizFinish, setQuizFinish] = React.useState(false)
    const [counter, setCounter] = React.useState(0)

	// Get the array of objects containing questions and answers using FETCH api
	React.useEffect(() => {
		fetch("https://opentdb.com/api.php?amount=5&type=multiple")
			.then((res) => res.json())
			.then((data) => {
				// create the quiz data
				const quizData = data.results.map((i) => {
					return {
						// question id
						qid: uuid(),
						// question text
						question: i.question,
						// combined correct and incorrect answers
						answers: [
							{
								value: i.correct_answer,
								isCorrect: true,
								id: uuid(),
                                isHeld: false,
							},
							...i.incorrect_answers.map((ans) => ({
								value: ans,
								isCorrect: false,
								id: uuid(),
                                isHeld: false,
							})),
						],
					};
				});
				// set the data in state
				setQuiz(quizData);
			});
	}, []);
    

	//Creating an Object containing all 5 correct answers against all 5 questions
	const actualAnswers = {};
	quiz.forEach((question) => {
		// the correct answer is always the first element of answers
		actualAnswers[question.qid] = question.answers[0].id;
	});


	// To store selected Q&A from child (Q.js) to parent (App.js)

	function selectedAnswers(id, qid, isCorrect) {
        // setQuiz(prev => ...prev, isHeld = isHeld! --> but add this on the specific prev.answers target )
		setAnswers((prev) => {
            return { ...prev, [qid]: id };
		});
	}

	//Mapping over quiz array to set the props for each question object
	let qElement = quiz.map((item) => (
		<Q
			item={item}
			key={item.qid}
			id={item.qid}
			selectedAnswers={selectedAnswers}
            isActive={isActive}
           
		/>
	));

function finalSubmit(){
    setIsActive(prev => !prev)  
}

const refresh = () => window.location.reload()
	//Rendering Q component
	return (
		<div className='main-element-app'>
			<h2>Epic Quiz App</h2>
			{qElement}
            
            <div className='resultAndButtonDiv'>
                <span className='result'>{JSON.stringify(actualAnswers) === JSON.stringify(answers) && isActive? `Wow 5/5, celebration time!`: result }</span>
                
                <button
                    className='button'
                    onClick={() => {
                        let total = 0;
                        for( let key in answers) {
                            if(actualAnswers[key] === answers[key]) {total++};
                        }
                        setResult(`You scored ${total}/5 correct answers`);
                        finalSubmit()
                        setCounter(prev => prev +1)
                        setQuizFinish(counter===1? refresh: false)
                    }}
                    >
                    {isActive? 'Play again':'Submit'}
                </button>
            </div>
             {isActive && JSON.stringify(actualAnswers) === JSON.stringify(answers) && <Confetti/>}
		</div>
	);
}
