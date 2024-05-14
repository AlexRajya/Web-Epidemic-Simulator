import React from "react";
import { IConfiguration, covid19 } from "../Simulation/Configuration";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface IEditSettingsProps {
  onSettingsChange: (settings: IConfiguration) => void;
  currentSettings: IConfiguration;
}

const EditSettings: React.FC<IEditSettingsProps> = ({
  onSettingsChange,
  currentSettings,
}: IEditSettingsProps) => {
  const [settings, setSettings] =
    React.useState<IConfiguration>(currentSettings);
  const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenSettingsDialog(true);
    setSettings(currentSettings);
  };
  const handleClose = () => {
    setOpenSettingsDialog(false);
  };

  const confirmChanges = () => {
    setOpenSettingsDialog(false);
    onSettingsChange(settings);
  };

  const setDefault = () => {
    setOpenSettingsDialog(false);
    onSettingsChange(covid19);
    setSettings(covid19);
  };

  //Floats have a min of 0 and a max of 1
  const validateFloat = (value: string): number => {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return 0;
    } else if (number < 0) {
      return 0;
    } else if (number > 1) {
      return 1;
    }

    return number;
  };

  //Numbers have a min of 0 but no maximum
  const validateNumber = (value: string): number => {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return 0;
    } else if (number < 0) {
      return 0;
    }
    return number;
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<TuneIcon />}
        onClick={handleClickOpen}
      >
        Settings
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openSettingsDialog}
      >
        <DialogTitle
          className="dialogTitle"
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
        >
          <div className="dialogTitleText">
            <TuneIcon sx={{ marginRight: "10px" }} />
            Edit Settings
          </div>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers className="dialog">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <ThemeProvider theme={darkTheme}>
              <TextField
                variant="filled"
                label="Edit Contact Infection Rate"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={settings.contactInfectionRate}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSettings((oldSettings) => ({
                    ...oldSettings,
                    contactInfectionRate: validateFloat(event.target.value),
                  }))
                }
              />
              <TextField
                variant="filled"
                label="Edit Immigration Rate"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={settings.immigrationRate}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSettings((oldSettings) => ({
                    ...oldSettings,
                    immigrationRate: validateFloat(event.target.value),
                  }))
                }
              />
              <TextField
                variant="filled"
                label="Edit Infected Immigration Rate"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={settings.illImmigrationRate}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSettings((oldSettings) => ({
                    ...oldSettings,
                    illImmigrationRate: validateFloat(event.target.value),
                  }))
                }
              />
              <TextField
                variant="filled"
                label="Edit Incubation Period"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={settings.incPeriod}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSettings((oldSettings) => ({
                    ...oldSettings,
                    incPeriod: validateNumber(event.target.value),
                  }))
                }
              />
              <TextField
                variant="filled"
                label="Edit Infection Period"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={settings.infPeriod}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSettings((oldSettings) => ({
                    ...oldSettings,
                    infPeriod: validateNumber(event.target.value),
                  }))
                }
              />
            </ThemeProvider>
            <Button variant="contained" onClick={confirmChanges}>
              Confirm
            </Button>
            <Button variant="contained" onClick={setDefault}>
              Revert to Default
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditSettings;
