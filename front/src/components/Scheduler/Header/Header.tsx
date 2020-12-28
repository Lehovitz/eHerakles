import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { AssignmentTurnedIn } from "@material-ui/icons";
import jwtDecode from "jwt-decode";
import { IconButton } from "material-ui";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import DecodedToken from "../../../models/DecodedToken";
import { RootState } from "../../../redux";
import { EventFront } from "../Scheduler";
import styles from "./Header.module.scss";

type HeaderProps = AppointmentTooltip.HeaderProps & {
    data: EventFront[];
    setData: React.Dispatch<React.SetStateAction<EventFront[]>>;
};

const Header = ({ appointmentData, setData, data, ...props }: HeaderProps) => {
    const [open, setOpen] = useState(false),
        [loading, setLoading] = useState(false),
        bearerToken = useSelector((state: RootState) => state.token),
        decodedToken: DecodedToken | undefined =
            bearerToken.token.length > 0
                ? jwtDecode(bearerToken.token)
                : undefined,
        email = decodedToken?.email ?? "",
        canUserSign =
            !appointmentData!.customers.includes(email) &&
            appointmentData!.customers.length < appointmentData!.capacity;

    const handleDialogOpen = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);

    const handleSignIn = async () => {
        setLoading(true);

        await fetch(
            `http://localhost:5000/events/sign/${appointmentData!.id}/${email}`,
            {
                method: "PUT",
            }
        );

        // TODO:: FIX

        const eventsCopy = [...data];
        const eventIndex = eventsCopy.findIndex(
            (event) => event.id === appointmentData!.id
        );
        eventsCopy[eventIndex].customers = [
            ...eventsCopy[eventIndex].customers,
            { email },
        ];

        setData(eventsCopy);

        setLoading(false);
        handleDialogClose();
    };

    return (
        <>
            <AppointmentTooltip.Header
                appointmentData={appointmentData}
                {...props}
            >
                <IconButton
                    onClick={handleDialogOpen}
                    className={styles.button}
                >
                    <AssignmentTurnedIn />
                </IconButton>
            </AppointmentTooltip.Header>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Sign in for a training</DialogTitle>

                <DialogContent dividers>
                    {canUserSign ? (
                        <>
                            Appointment data:{" "}
                            {JSON.stringify(appointmentData) + "\n"}
                            TODO:: Może jakieś inne dane, ilość miejsc wolnych,
                            przypomnienie jaki jest trener, pokój, data
                        </>
                    ) : (
                        <>This event is full or you've already signed for it.</>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={handleDialogClose}>
                        Close
                    </Button>
                    {canUserSign && (
                        <Button
                            startIcon={
                                loading && <CircularProgress size={10} />
                            }
                            disabled={loading}
                            color="primary"
                            onClick={handleSignIn}
                        >
                            Sign in
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Header;
