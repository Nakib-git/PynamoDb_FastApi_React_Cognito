
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface NotificationProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'delete';
}

export const notification = (prop: NotificationProps) => {
  switch (prop.type) {
    case 'info':
      toast[prop.type]('Info!' + prop.message, {
        position: 'bottom-center',
        autoClose: 5000 // Close the notification after 5 seconds
      });
      break;
    case 'success':
      toast[prop.type]('Success!' + prop.message, {
        position: 'bottom-center',
        autoClose: 5000 // Close the notification after 5 seconds
      });
      break;
    case 'warning':
      toast[prop.type]('Warnng!' + prop.message, {
        position: 'bottom-center',
        autoClose: 5000 // Close the notification after 5 seconds
      });
      break;
    case 'error':
      toast[prop.type]('Error!' + prop.message, {
        position: 'bottom-center',
        autoClose: 5000 // Close the notification after 5 seconds
      });
      break;
    case 'delete':
      toast['error']('Delete!' + prop.message, {
        position: 'bottom-center',
        autoClose: 5000 // Close the notification after 5 seconds
      });
      break;

    default:
      break;

  }

};


