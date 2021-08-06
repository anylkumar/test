const mongoose = require('mongoose');
const candidate = require('./models/candidate');

mongoose.connect('mongodb://localhost:27017/candidateDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const seedcandidates = [
    {
        username: 'TOM',
        email: 'tom@gmail.com'
    },
    {
        username: 'JERRY',
        email: 'jerry@gmail.com'
    },
    {
        username: 'BROWNY',
        email: 'browny@gmail.com'
    }
]


candidate.insertMany(seedcandidates)
    .then(res => {
        console.log(res)
    })
    .catch(res => {
        console.log(err)
    })