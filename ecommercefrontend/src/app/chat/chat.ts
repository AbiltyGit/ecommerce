import { Component, ElementRef, ViewChild, AfterViewChecked, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService, ChatMessage } from '../services/chat';
import { AuthService } from '../services/auth';
import { PlotlyRender } from '../plotly-render/plotly-render';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, PlotlyRender],
  templateUrl: './chat.html'
})
export class Chat implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  question = '';
  loading = false;
  messages: (ChatMessage & { visualizationCode?: string, data?: any[] })[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.messages = [...this.chatService.getHistory()];
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  logout() {
    this.authService.logout();
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatMessage(content: string): string {
    if (!content) return '';
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  ask() {
    if (!this.question.trim()) return;
    
    const userMsg = this.question;
    this.question = '';
    
    const newMsg: ChatMessage = { role: 'user', content: userMsg };
    this.chatService.addMessage(newMsg);
    this.messages = [...this.chatService.getHistory()];
    
    this.loading = true;
    this.cdr.detectChanges();
    
    console.log("DEBUG: Sending request to backend...");
    
    this.chatService.askQuestion(userMsg).subscribe({
      next: (res) => {
        this.zone.run(() => {
          console.log("DEBUG: Received response from backend:", res);
          const assistantMsg: ChatMessage & { visualizationCode?: string, data?: any[] } = {
            role: 'assistant',
            content: res.answer || "No answer provided.",
            visualizationCode: res.visualizationCode,
            data: res.data
          };
          this.chatService.addMessage(assistantMsg);
          this.messages = [...this.chatService.getHistory()];
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error("DEBUG: HTTP Request Error:", err);
          const errorMsg: ChatMessage = {
            role: 'assistant',
            content: 'Sorry, I encountered an error while connecting to the Agentic Bridge. Check the browser console.'
          };
          this.chatService.addMessage(errorMsg);
          this.messages = [...this.chatService.getHistory()];
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
