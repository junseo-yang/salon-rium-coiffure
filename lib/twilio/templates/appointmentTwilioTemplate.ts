/* eslint-disable @typescript-eslint/no-unused-vars */
type Params = {
    id: string;
    price: string;
    status: string;
    from_date: Date;
    to_date: Date;
    duration: string;
    customer_name: string;
    customer_number: string;
    customer_email: string;
    service_name: string;
    staff_name: string;
    current: Date;
    action: string;
};

export function compileAppointmentTwilioTemplate({
    id,
    price,
    status,
    from_date,
    to_date,
    duration,
    customer_name,
    customer_number,
    customer_email,
    service_name,
    staff_name,
    current,
    action
}: Params) {
    return `(Salon Rium Coiffure) Hi ${customer_name}. Your appointment has been ${action} in our Salon Rium Coiffure on ${current.toLocaleString(
        "en-US",
        {
            timeZone: "America/New_York",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    )}. Detail - From: ${from_date.toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })} / To: ${to_date.toLocaleString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })} / Duration: ${duration} / Service: ${service_name} / Designer: ${staff_name} / Total: $${price} / Status: ${status} / Name: ${customer_name} / Phone: ${customer_number} / Email: ${customer_email}`;
}
