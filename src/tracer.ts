import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';

const exporterOptions = {
    url: process.env.OTEL_EXPORTER_OTLP_SPAN_ENDPOINT,
};

const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
        new NestInstrumentation(),
        new ExpressInstrumentation({
            ignoreLayers: [/\/health/, /\/metrics/],
        }),
        new HttpInstrumentation({
            ignoreIncomingRequestHook: (req) => {
                return ['/health', '/metrics'].includes(req.url);
            },
        }),
        new PrismaInstrumentation({ middleware: true }),
        new WinstonInstrumentation(),
    ],
    resource: new Resource({
        [ATTR_SERVICE_NAME]: 'auth-api',
    }),
});
sdk.start();

process.on('SIGTERM', () => {
    sdk
        .shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
});

export default sdk;
