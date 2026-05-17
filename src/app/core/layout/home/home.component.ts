import { AfterViewInit, Component, computed, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon, MatIconRegistry } from "@angular/material/icon";
import { FeatureItem } from "../../models/feature-model";
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { JwtService } from "../../services/jwt.service";
import { inject } from '@angular/core';
@Component({
    standalone: true,
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
    imports: [MatButtonModule, MatDivider, MatIcon, CommonModule, NgOptimizedImage]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('aboutSection') aboutSection!: ElementRef;
    private jwtService = inject(JwtService);
    // Signals and Data
    displayedText = signal<string>('');
    currentImageIndex = 0;
    progressWidth = 0;
// Component TS
public authStatus = computed(() => this.jwtService.isAuthenticatedStatus());
    // Intervals and Observers
    private rotationIntervalId: any;
    private progressIntervalId: any;
    private observer: IntersectionObserver | null = null;

    // Typing Effect State
    private phrases: string[] = [
        "I need to connect my project management tools with my team management software",
        "I need to create webhooks to automate my workflow",
        "I need to automate my task management process",
        "I need to manage PRs and issues across multiple repositories",
    ];
    private phraseIndex = 0;
    private charIndex = 0;
    private isDeleting = false;
// Create a computed signal or just a getter that points to the service's state
public isUserLoggedIn = computed(() => this.jwtService.isAuthenticatedStatus());
    infoData: FeatureItem[] = [

        {

            title: "Workspace Providers",

            description: "Choose your preferred workspace provider to integrate with our platform.",

            image: "assets/providers.png"

        },

        {

            title: "Provider Webhooks",

            description: "Set up webhooks to receive real-time updates from your workspace providers.",

            image: "assets/webhooks.png"

        },

        {

            title: "AI-Powered Automation",

            description: "Leverage AI to automate your task management and boost your productivity.",

            image: "assets/ai.png"

        },

        {

            title: "PRs Management",

            description: "Effortlessly manage and track pull requests within your development workflow.",

            image: "assets/pr.png"

        },
        {

            title: "Insights",

            description: "Effortlessly manage and track pull requests within your development workflow.",

            image: "assets/insights.png"

        }


    ];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {

     }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.type();
        }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.setupIntersectionObserver();
        }
    }

    ngOnDestroy() {
        this.stopImageRotation();
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    // --- Image Rotation & Progress Logic ---

    startImageRotation() {
        if (this.rotationIntervalId || !isPlatformBrowser(this.platformId)) return;

        const rotationTime = 5000; // 10 seconds
        const updateInterval = 100; // Update progress every 100ms
        const step = (updateInterval / rotationTime) * 100;

        this.rotationIntervalId = setInterval(() => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.infoData.length;
            this.progressWidth = 0; // Reset bar on image change
        }, rotationTime);

        this.progressIntervalId = setInterval(() => {
            if (this.progressWidth < 100) {
                this.progressWidth += step;
            }
        }, updateInterval);
    }

    stopImageRotation() {
        if (this.rotationIntervalId) {
            clearInterval(this.rotationIntervalId);
            this.rotationIntervalId = null;
        }
        if (this.progressIntervalId) {
            clearInterval(this.progressIntervalId);
            this.progressIntervalId = null;
        }
    }

    setupIntersectionObserver() {
        const options = { threshold: 0.5 };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startImageRotation();
                } else {
                    this.stopImageRotation();
                }
            });
        }, options);

        if (this.aboutSection) {
            this.observer.observe(this.aboutSection.nativeElement);
        }
    }

    // --- Typing Effect Logic ---

    type() {
        const currentPhrase = this.phrases[this.phraseIndex];
        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.charIndex < currentPhrase.length) {
            this.charIndex++;
            typeSpeed = 100;
        } else if (this.isDeleting && this.charIndex > 0) {
            this.charIndex--;
            typeSpeed = 50;
        } else if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            typeSpeed = 500;
        }

        this.displayedText.set(currentPhrase.substring(0, this.charIndex));
        setTimeout(() => this.type(), typeSpeed);
    }

    navigateToLogin() {
        window.location.href = "/auth";
    }
    navigateToDashboard() {
        window.location.href = "/dashboard";
    }
}