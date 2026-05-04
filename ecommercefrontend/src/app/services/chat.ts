import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  data: any[];
  visualizationCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API_URL = '/api/chat/ask';
  private chatHistory: ChatMessage[] = [];

  constructor(private http: HttpClient) { }

  getHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  addMessage(msg: ChatMessage) {
    this.chatHistory.push(msg);
  }

  askQuestion(question: string): Observable<ChatResponse> {
    const payload = {
      question: question,
      chatHistory: this.chatHistory
    };
    return this.http.post<ChatResponse>(this.API_URL, payload);
  }
}
