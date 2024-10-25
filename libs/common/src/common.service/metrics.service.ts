import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry, Summary } from 'prom-client';

@Injectable()
export class MetricsService {
    private readonly registry: Registry;
    private readonly requestDuration: Summary<string>;
    private readonly userAgentCounter: Counter<string>;
    private readonly methodCounter: Counter<string>;
    private readonly statusCounter: Counter<string>;
    private readonly endpointCounter: Counter<string>;

    constructor() {
        this.registry = new Registry();
        collectDefaultMetrics({ register: this.registry });

        this.requestDuration = new Summary({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'status', 'endpoint'],
        });

        this.userAgentCounter = new Counter({
            name: 'http_user_agent_requests_total',
            help: 'Number of requests by user-agent',
            labelNames: ['userAgent'],
        });

        this.methodCounter = new Counter({
            name: 'http_method_requests_total',
            help: 'Number of requests by method',
            labelNames: ['method'],
            registers: [this.registry],
        });

        this.statusCounter = new Counter({
            name: 'http_status_requests_total',
            help: 'Number of requests by status',
            labelNames: ['status'],
            registers: [this.registry],
        });

        this.endpointCounter = new Counter({
            name: 'http_endpoint_requests_total',
            help: 'Number of requests by endpoint',
            labelNames: ['endpoint'],
            registers: [this.registry],
        });
    }

    recordRequest(
        method: string,
        url: string,
        statusCode: number,
        elapsedTime: number,
        userAgent: string,
    ) {
        this.requestDuration.observe(
            { method, status: statusCode.toString(), endpoint: url },
            elapsedTime,
        );

        this.userAgentCounter.inc({ userAgent });
        this.methodCounter.inc({ method });
        this.statusCounter.inc({ status: statusCode.toString() });
        this.endpointCounter.inc({ endpoint: url });
    }
}
