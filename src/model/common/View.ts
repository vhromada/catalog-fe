export enum ModalAction {

  OPEN = 'OPEN',
  CLOSE = 'CLOSE'

}

export class ModalEvent<T> {

  action: ModalAction;
  data?: T;

  constructor(action: ModalAction, data?: T) {
    this.action = action;
    this.data = data;
  }

  isOpen(): boolean {
    return this.action === ModalAction.OPEN;
  }

  ifOpen(action: any): void {
    if (this.isOpen()) {
      action();
    }
  }

}

export function isModalOpen(event: ModalEvent<any>): boolean {
  return event?.action === ModalAction.OPEN;
}

export function modalOpen<T>(data?: T): ModalEvent<T> {
  return new ModalEvent(ModalAction.OPEN, data);
}

export function modalClose<T>(data?: T): ModalEvent<T> {
  return new ModalEvent(ModalAction.CLOSE, data);
}
