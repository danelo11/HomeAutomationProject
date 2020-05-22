const moongoose = require('mongoose');

const { HOME_AUTOMATION_HOST, HOME_AUTOMATION_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${HOME_AUTOMATION_HOST}/${HOME_AUTOMATION_DATABASE}`;

moongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(db => console.log('DB connected succesfully'))
.catch(err => console.log(err));