# Examer
CLI application for exam evaluation.

This application was developed as an presentation for the Platinum itinerary of Maths from [Colégio Madre Carmen Salles](https://colegiomadrecarmensalles.org.br/)

## Advantages
### Influence calculation
The advantage of this program is the hability to calculate how much does a person knows for a specific subject. For example, you can give how much knowledge of an subject is required to make a specific question, and then based on that the program will grab that information and give how much the answers know for that subject.

## Installation
1. Install [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/)
2. Clone the repo
```sh
git clone https://github.com/abUwUser/Examer
```
3. Install the dependencies
```sh
npm install --save-dev
```
4. Run the pos-install script
```sh
npm run pos-install
```

## Usage
### Structure
First, you need to create a JSON file in a desired folder that should be your exam file. It should look something simmilar to this
```json
// exam.json (do not copy this line)
[
    {
        "statement": "Write the expression of log₂32 = 5 in exponential form",
        "influence": {
            "Logarithm": 0.4,
            "Exponential": 0.4,
            "Basic Math": 0.2
        },
        "answer": ["2^5=32", "2⁵=32", "2^5 = 32", "2⁵ = 32"]
    },
    {
        "statement": "Find the square root of 5929",
        "influence": {
            "Square Root": 0.9,
            "Basic Math": 0.1
        },
        "answer": "77"
    },
    {
        "identifier": "3.a",
        "statement": "Calculate the volume of the cylinder with radius 5 and height 6 while considering π = 3.1. Do not put the units in the answer.",
        "influence": {
            "Cylinder": 0.7,
            "Basic Math": 0.3
        },
        "score": 0.5,
        "answer": "465"
    },
    {
        "identifier": "3.b",
        "statement": "Calculate the side area of a cone with radius 7 and generatrix 3 while considering π = 3. Do not put the units in the answer.",
        "influence": {
            "Cylinder": 0.1,
            "Cone": 0.4,
            "Basic Math": 0.3
        },
        "score": 0.5,
        "answer": "63"
    }
]
```

### Running it
```sh
examer <command> [options]
```

## Documentation
### Exam
It is a file that should contain the exam structure to then compare with the answers. It is an array of the [`Question`](#question) type. [Click here for an example](/example/exam.json)

### Answers
It is a file that contains an array of [Answers](#answer-types) and [UserAnswers](#answer-types). [Click here for an example](/example/users/Anna%20Julia.json)

### Types
#### Question
Object that gives the question's information
* `answer` ([Answer](#answer-types) | Array\<[Answer](#answer-types)> | null): The correct answer. If it is gave an array, it will check for multiple answers
* `statement`? (string): The statement of the question.
* `influences`? ([Influence](#influence)): How much does an subject it is required to make that question.
* `identifier`? (string): How this question should be numbered. Example: `4.c.`

#### Influence
Object that gives how much does the answer needs to know about an subject to make that question. [Check here for more information](#influence-calculation)
* `[subject]` (number): A number that says how much is the influence of that object

#### UserAnswer
Object that gives more clarity to the answer, and can override some values given by the exam.
* `value` ([Answer](#answer-types)): The answer
* `override`? (object): Prefers values from this class than from the exam. [Check an example](https://github.com/abUwUser/Examer/blob/fbf73097461278b9163cabc7e75c9573c8a27947/example/users/Ana%20Julia.json#L7-L14)
    * `influence`? ([Influence](#influence)): How much does an subject it is required to make that question.
    * `score`? (number): The score that should be considered instead

#### Answer types
Type that gives an answer. Possible values:
- string
- boolean