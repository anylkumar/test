const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const methodOverride = require('method-override');
const Candidate = require('./models/candidate');
const Testscore = require('./models/testscore');

const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/candidateDB', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.get('/', (req, res) => {
    res.render('candidates/home')
})

// candidate routes
app.get('/candidates', async (req, res) => {
    const candidates = await Candidate.find({})
    res.render('candidates/index', { candidates })
})

app.get('/candidates/new', (req, res) => {
    res.render('candidates/new')
});

app.get('/candidates/:id/testscore/add', async (req, res) => {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    res.render('testscore/add', { id, candidate })
})

app.post('/candidates', async (req, res) => {
    const newCandidate = new Candidate({
        username: req.body.username,
        email: req.body.email
    })
    await newCandidate.save()
    res.redirect(`/candidates/${newCandidate._id}`)
})

app.get('/candidates/highestScorers', async (req, res) => {
    const topper = await Testscore.find().sort({ total: -1 }).limit(1).populate('candidate')
    res.render('candidates/highestscore', { topper })
})

app.get('/candidates/avgScore', async (req, res) => {
    const scores = await Testscore.find({})
    res.render('candidates/avgScore', { scores })
})



app.post('/candidates/:id/testscores', async (req, res) => {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    const { test_score1, test_score2, test_score3 } = req.body;
    const total = parseInt(test_score1) + parseInt(test_score2) + parseInt(test_score3)
    const testscore = new Testscore({ test_score1, test_score2, test_score3, total })
    candidate.testscores.push(testscore);
    testscore.candidate = candidate;
    await candidate.save()
    await testscore.save()
    res.redirect(`/candidates/${id}`)
})


app.get('/candidates/:id', async (req, res) => {
    const { id } = req.params;
    const candidate = await Candidate.findById(id).populate('testscores');
    const lenValue = candidate.testscores.length
    res.render('candidates/details', { candidate, lenValue })
});

app.get('*', (req, res) => {
    res.send("404! Page not found!")
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})





// test score routes
// app.get('/testscores', async (req, res) => {
//     const testscores = await Testscore.find({})
//     res.render('testscore/show', { testscores })
// });

// app.get('/addscore', (req, res) => {
//     res.render('testscore/score')
// });

// app.post('/testscore', async (req, res) => {
//     const newScore = new Testscore({
//         test_score1: req.body.test_score1,
//         test_score2: req.body.test_score2,
//         test_score3: req.body.test_score3,
//     })
//     await newScore.save()
//     res.redirect('/testscores')
// })

// app.get('/testscores/:id', async (req, res) => {
//     const { id } = req.params;
//     const testscore = await Testscore.findById(id);
//     res.render('testscore/show', { testscore })
// });