// select element
let questionsCount = document.querySelector(".questions-count span");
let quizArea = document.querySelector(".quiz-area")
let answerArea = document.querySelector(".answer-area")
let submitButton = document.querySelector(".submit-button")
let bulets = document.querySelector(".footer .bulets")
let resultDiv = document.querySelector(".result")
let timerDiv = document.querySelector(".timer")

// set
let num = 0;
let count;
let rqus = 0;
let timer;

// localstorage

let getLocalR = localStorage.getItem("Rquestion")
let getLocalC = localStorage.getItem("Countques")

if (getLocalR !== null) {
    document.querySelector(".body").remove()
    document.querySelector(".submit").remove()
    document.querySelector(".footer").remove()
    reseat()
    if (getLocalR > (getLocalC / 2) && getLocalR < getLocalC) {
        resultDiv.innerHTML = `<span class="good">Good</span>, ${getLocalR} From ${getLocalC}`;
    }else if (getLocalR === getLocalC) {
        resultDiv.innerHTML  = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
        resultDiv.innerHTML  = `<span class="bad">Bad</span>, ${getLocalR} From ${getLocalC}`;
    }
}



function getAnswer() {
    let jsonObj = new XMLHttpRequest()

    jsonObj.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            let myObjQuestion = JSON.parse(jsonObj.responseText)
            count = myObjQuestion.length
            questionsCount.innerHTML = count

            
            setquizArea(myObjQuestion[num].title)
            
            setAnswer(myObjQuestion[num])

            Creatbullets()

            if (num < count) {
                timOut(120)
            }

            
            let rAnswer;

            submitButton.onclick = () => {
                if (num < count) {
                    rAnswer = myObjQuestion[num].right_answer
                }
                setchoesAnser(rAnswer)
                num++
                if (num < count) {
                    quizArea.innerHTML = ""
                    answerArea.innerHTML = ""
                    setquizArea(myObjQuestion[num].title)
                    setAnswer(myObjQuestion[num])
                    HandelBullets()
                }
                if (num === count) {
                    result()
                    localStorage.setItem("Rquestion", rqus)
                    localStorage.setItem("Countques", count)
                    reseat()
                }
            }
            
        }
    }
    jsonObj.open("GET", "http://myjson.dit.upm.es/api/bins/53cm", true)
    jsonObj.open("GET", "Qus-Json.json", true)
    jsonObj.send()
}
getAnswer()



function setquizArea(qus) {
    let h2 = document.createElement("h2");
    let text = document.createTextNode(qus)
    h2.appendChild(text)
    quizArea.appendChild(h2)
}

function setAnswer(answer) {
    for (let i = 1; i <= 4; i++) {
        let anserContainer = document.createElement("div")
        let inp = document.createElement("input")
        let label = document.createElement("label")
        let answerContet = document.createTextNode(answer[`answer_${i}`])

        anserContainer.className = "answer"
        inp.type = "radio"
        inp.name = "answer"
        inp.id = `answer-${i}`
        inp.dataset.answer = answer[`answer_${i}`]
        label.htmlFor = `answer-${i}`
        label.appendChild(answerContet)

        anserContainer.appendChild(inp)
        anserContainer.appendChild(label)
        answerArea.appendChild(anserContainer)
    }
}

function setchoesAnser(rAnswer) {
    let choesAnserInput = document.getElementsByName("answer")
    let choesAnser;
        choesAnserInput.forEach((choes) => {
            if (choes.checked) {
                choesAnser = choes.dataset.answer
            }
        })

    if (rAnswer === choesAnser) {
        rqus++
    }
}

function Creatbullets() {
    for (let i = 0; i < count; i++) {
        let spans = document.createElement("span")
        bulets.appendChild(spans)
        if (i === 0) {
            spans.className = "on"
        }
    }
    

}

function HandelBullets() {
    let spans = document.querySelectorAll(".footer .bulets span")
    let arr = Array.from(spans)
    arr.forEach((span, index) => {
        if (num === index) {
            span.className = "on"
        }
    })
}

function result() {
    document.querySelector(".body").remove()
    document.querySelector(".submit").remove()
    document.querySelector(".footer").remove()
    if (rqus > (count / 2) && rqus < count) {
        resultDiv.innerHTML = `<span class="good">Good</span>, ${rqus} From ${count}`;
    }else if (rqus === count) {
        resultDiv.innerHTML  = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
        resultDiv.innerHTML  = `<span class="bad">Bad</span>, ${rqus} From ${count}`;
    }
}

function timOut(minutSet) {
    timer = setInterval(() => {
        let minute = Math.floor(minutSet / 60)
        let sec = minutSet % 60
        let a = (count - num)

        minute = minute < 10 ? `0${minute}` : minute ;
        sec = sec < 10 ? `0${sec}` : sec ;

        timerDiv.innerHTML = `${minute} : ${sec}`
        if (minutSet === 0) {
                clearInterval(timer)
                for (let i = 0; i < a; i++) {
                    submitButton.click()
                }
            }
        
        --minutSet
    }, 1000);

}

function reseat() {
    let reseatDiv = document.querySelector(".reseat")
    reseatDiv.textContent = "reseat";
    reseatDiv.classList.add("show")
    reseatDiv.onclick = () => {
        localStorage.clear()
        window.location.reload()
    }
}