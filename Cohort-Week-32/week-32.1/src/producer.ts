import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

const run = async () => {
    // Producing 
    await producer.connect();
    await producer.send({
        topic: 'payments-done',
        messages: [
            { value: 'Hello KafkaJS user from nodejs process!' },
        ],
    });
};

run().catch(console.error);
