import mongoose from 'mongoose';

class MongoDB {
  connection: mongoose.Connection | {readyState?: boolean};
  isReady: mongoose.ConnectionStates | boolean;

  constructor() {
    this.connection = {};
    this.isReady = false;
  }

  async connect() {
    if (this.connection.readyState) {
      return this.connection;
    }

    const db = await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    this.connection = db.connections[0];
    this.isReady = this.connection.readyState;
    console.log(`connetion is ${this.connection.readyState}`);

    return this.connection;
  }
}

const mongoDB = new MongoDB();

export default mongoDB;
