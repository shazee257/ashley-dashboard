import moment from 'moment';

export const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
}

export const formatDateOnlyTime = (date) => {
    return moment(date).format("hh:mm a");
}

export const formatDateTime = (date) => {
    return moment(date).format("DD MMM YYYY hh:mm a");
}