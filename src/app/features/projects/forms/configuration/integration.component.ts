import { Component, inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ProjectsService } from '../../../../core/services/projects.service';
@Component({
    selector: 'app-integration-callback',
    template: `<p>Connecting to Trello...</p>`
})
export class IntegrationCallbackComponent implements OnInit {
    private integrationService = inject(ProjectsService);
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

   ngOnInit(): void {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  const hash = new URLSearchParams(window.location.hash.slice(1));
  const query = new URLSearchParams(window.location.search);

  const token = hash.get('token') || query.get('token');
  const projectId = query.get('projectId');
  const companyId = query.get('companyId');

  if (!token) {
    window.opener?.postMessage('integration-failed', window.origin);
    window.close();
    return;
  }
  this.integrationService.connectTrello({
    token,
    projectId: Number(projectId),
    companyId: Number(companyId)
  }).subscribe({
    next: (res) => {
      window.opener?.postMessage('integration-success', window.origin);
      window.close();
    },
    error: (err) => {
      console.error('SAVE FAILED:', err);

      window.opener?.postMessage('integration-failed', window.origin);
      window.close();
    }
  });
}
}