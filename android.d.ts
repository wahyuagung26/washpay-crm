interface Window {
  sendTransactionWithDebug?: (transactionData: any) => void;
  sendTransactionToAndroid?: (transactionData: any) => void;
  showPrinterSelectionDialog?: () => void;
  getSelectedPrinter?: () => any;
}