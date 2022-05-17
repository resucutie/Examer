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
```sh
examer <command> [options]
```
### Commands
* `general <exam> <answers>` - Shows a table of the general scores of the answers
    * `<exam>`: [The exam file](#exam)
    * `<answers>`: The answers folder

* `individual <exam> <answer>` - Shows a table of the general scores of the answers
    * `<exam>`: [The exam file](#exam)
    * `<answer>`: The answer file


## Documentation
### Exam
It is a file that should contain the exam structure to then compare with the answers. It is an array of the [`Question`](#question) type. [Click here for an example](/example/exam.json)

### Answers
It is a file that contains an array of [Answers](#answer-types). [Click here for an example](/example/users/Pedro%20Cartaxo.json)

### Types
#### Question
Object that gives the question's information
* `statement`? (string): The statement of the question.
* `influences`? ([Influence](#influence)): How much does an subject it is required to make that question.
* `answer` ([Answer](#answer-types) | Array\<[Answer](#answer-types)> | null): The correct answer. If it is gave an array, it will check for multiple answers

#### Influence
Object that gives how much does the answer needs to know about an subject to make that question. [Check here for more information](#influence-calculation)
* `[subject]` (number): A number that says how much is the influence of that object

#### Answer types
Type that gives an answer. Possible values:
- string
- boolean