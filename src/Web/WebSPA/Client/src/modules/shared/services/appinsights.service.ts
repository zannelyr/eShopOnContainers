import { Injectable } from '@angular/core';
import * as applicationinsightsWeb from '@microsoft/applicationinsights-web';
import { StorageService } from './storage.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter, isEmpty } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApplicationInsightsService {
    private appInsights: applicationinsightsWeb.ApplicationInsights;

    constructor(private router: Router) {
       
    }
    load() {
        var aiKey = '18497819-0229-4942-8781-b1411e06ca09';
        this.appInsights = new applicationinsightsWeb.ApplicationInsights({
            config: {
                instrumentationKey: aiKey,
                enableAutoRouteTracking: true,
                autoTrackPageVisitTime: true
            }
        });

        this.appInsights.loadAppInsights();
        this.loadCustomTelemetryProperties();
    }
    logTrace(message: string, properties?: { [key: string]: any }) {
        this.appInsights.trackTrace({ message: message }, properties);
    }
    logMetric(name: string, average: number, properties?: { [key: string]: any }) {
        this.appInsights.trackMetric({ name: name, average: average }, properties);
    }
    setUserId(userId: string) {
        this.appInsights.setAuthenticatedUserContext(userId);
    }
    clearUserId() {
        this.appInsights.clearAuthenticatedUserContext();
    }
    logPageView(name?: string, uri?: string, workstation?: string) {
        let MyPageView: applicationinsightsWeb.IPageViewTelemetry = { name: name, uri: uri, properties: { ['workstation']: workstation } }
        this.appInsights.trackPageView(MyPageView);
    }
    logException(error: Error) {
        let exception: applicationinsightsWeb.IExceptionTelemetry = {
            exception: error
        };
        this.appInsights.trackException(exception);
    }

    private loadCustomTelemetryProperties() {
        this.appInsights.addTelemetryInitializer(envelope => {
            var item = envelope.baseData;
            item.properties = item.properties || {};
            if (window.performance) { item.properties["Perf"] = window.performance; }
            item.properties["ApplicationPlatform"] = "webSPA";
            item.properties["ApplicationName"] = "eShop";
            if (item.url === 'socket.io') { return false; }
        }
        );
    }
}