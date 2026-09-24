export const getSubmissionStatus = (submittedAt, deadline) => {
  return new Date(submittedAt) <= new Date(deadline) ? "On Time" : "Late";
};

export const getMissingStatus = (deadline, submitted) => {
  if (submitted) return submitted.status;
  return new Date() > new Date(deadline) ? "Missing" : "Pending";
};
