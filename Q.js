import React from "react";
import he from 'he'

export default function Q(props) {
	const [selected, setSelected] = React.useState("");
        
	// ansList is the list of answers created using mapping over the array containing all options
	let ansList = props.item.answers.map((ans) => (
			<button key={ans.id}
                disabled = {props.isActive}
                
                style={{backgroundColor: !props.isActive && ans.id===selected ? "gray" : 
                !props.isActive && ans.id===!selected? 'white':
                props.isActive && ans.isCorrect? '#c8d934' :
                props.isActive && !ans.isCorrect && ans.id === selected?'#F8BCBC':'white'}}
                className='individualAnswer'
                onClick={() => {
                    setSelected(ans.id);
                    props.selectedAnswers(ans.id, props.item.qid, ans.isCorrect);
                }} 
            >
				{he.decode(ans.value)}
			</button>
		))
		// .sort(() => Math.random() - 0.5); ---> This is cause shuffling issue at render. I will resolve it later
        
    
	// Correct answer stored in variable
	let correctAnsId = props.item.answers[0].id;

	//Copy of ansList to display in DOM
	const copyAnsList = ansList.slice();

	return (
		<main className = 'ques-ans'>
			<h3 className='question'>{he.decode(props.item.question)}</h3>
			<div className='answers'>{copyAnsList}</div>
            <hr/>
		</main>
	);
}
