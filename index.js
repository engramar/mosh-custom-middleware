const { config } = require('dotenv');
const Joi = require('joi');
const logger = require('./logger');
const authenticator = require('./authenticator');
const express = require('express');
const app = express();

app.use(express.json());

//Custom middleware functions
app.use(logger);
app.use(authenticator);

config();

const courses = [
    {id: 1, name: 'course1' },
    {id: 2, name: 'course2' },
    {id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id was not found');
    res.send(course);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});

app.post('/api/courses', (req, res) => {
    const schema = Joi.object({ name: Joi.string().min(3).required()});            
    const validation = schema.validate(req.body); 
    if (validation.error) {
        return res.status(400).send(result.error.details[0].message);        
    }
    console.log(validation);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id was not found');
        
    const schema = Joi.object({ name: Joi.string().min(3).required()});            
    const validation = schema.validate(req.body); 
    if (validation.error) return res.status(400).send(result.error.details[0].message);

    course.name = req.body.name;
    res.send(course)
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given Id was not found');
   
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    res.send(course);
});

const PORT = parseInt(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});