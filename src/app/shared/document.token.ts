// src/app/shared/document.token.ts

import { InjectionToken } from '@angular/core';

export const DOCUMENT_TOKEN = new InjectionToken<Document>('DocumentToken', {
  providedIn: 'root',
  factory: () => document, // Retorna o objeto global document
});
