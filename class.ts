interface Person {
  name: string;
}

class Teacher {
  role: string = 'teacher';
}

class MathTeacher extends Teacher implements Person {
  name: string = 'Tyler';
}

const mathTeacher = new MathTeacher();
console.log(mathTeacher.name);

class ScienceTeacher extends Teacher implements Person {
  name = 'John';
}
let scienceTeacher = new ScienceTeacher();

function greet(person: Person) {
  console.log('Hello ' + person.name);
}

greet(mathTeacher);
greet(scienceTeacher);
