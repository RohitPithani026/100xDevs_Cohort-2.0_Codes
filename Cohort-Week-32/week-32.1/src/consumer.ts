import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'my-app3' });

const run = async () => {
    // Consuming 
    await consumer.connect();
    await consumer.subscribe({ topic: 'payments-done', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (!message.value) {
                return;
            }
            console.log({
                partition, 
                offset: message.offset,
                value: message.value.toString(), 
            });
        },
    });
};

run().catch(console.error);
