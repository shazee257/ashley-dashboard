
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showNotification = (errorResponse, message, type = 'success') => {
  try {
    if (errorResponse && errorResponse.response) {
      if (errorResponse.response.data) toast.error(errorResponse.response.data.message || "Request couldn't be completed");
    } else if (message && type) {
      toast[type](message);
    } else if (errorResponse) {
      toast.error("Server responded with some error, Try contacting support team.");
    } else {
      toast[type]("Request Completed Successfully");
    }

  } catch (error) {
    toast.error("Server responded with some error, Try contacting support team.");
  }
}

