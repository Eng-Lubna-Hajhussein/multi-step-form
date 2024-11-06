import React, { useState } from "react";
import { useForm, Controller } from "@basetoolkit/ui/form";
import {
  Checkbox,
  TextField as Input,
  Switch,
  Autocomplete,
  Rating,
  Slider,
  Button,
  FormLabel,
  Grid,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Stepper,
  Step,
  StepLabel,
  Paper,
  StepConnector,
  SvgIcon,
  cssInjection as styled,
  Typography,
  useCSSClass,
  Box,
  Divider,
  ThemeProvider,
  createTheme,
} from "@basetoolkit/ui";
import { typographyClasses } from "@basetoolkit/ui/classes";

const CustomConnector = styled(StepConnector)({
  top: 22,
  mx: 1,
  backgroundImage:
    "linear-gradient( 95deg, rgb(33,150,243) 0%, rgb(30,136,229) 50%, rgb(21,101,192) 100%) !important",
});

const CustomStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#bdbdbd",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  mr: 1,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[800],
  }),
  variants: [
    {
      props: { active: true },
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(33,150,243) 0%, rgb(30,136,229) 50%, rgb(21,101,192) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: { completed: true },
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(33,150,243) 0%, rgb(30,136,229) 50%, rgb(21,101,192) 100%)",
      },
    },
  ],
}));

function CustomStepIcon(props) {
  const { active, completed, className, index } = props;

  const icons = {
    0: (
      <SvgIcon
        icon="production_quantity_limits"
        color="white"
        variant="filled"
      />
    ),
    1: <SvgIcon icon="feedback" color="white" variant="filled" />,
    2: <SvgIcon icon="add_circle" color="white" variant="filled" />,
  };

  return (
    <CustomStepIconRoot
      completed={completed}
      active={active}
      className={className}
    >
      {icons[String(index)]}
    </CustomStepIconRoot>
  );
}

const steps = ["Product Details", "Feedback Details", "Additional Information"];

const FeedbackForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    resetForm,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      rating: 2.5,
      feedback: "",
      recommend: "yes",
      features: [],
      email: "",
      subscribe: true,
      satisfaction: 50,
      promoOptIn: true,
    },
  });

  const onSubmit = (data) => {
    if (activeStep === steps.length - 1) {
      setSubmittedData(data);
      setIsSubmitted(true);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel>Product Name</FormLabel>
              <Controller
                name="productName"
                label="Ordered Product"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter the product name"
                    error={Boolean(errors?.productName?.message)}
                    helperText={
                      errors.productName ? errors.productName.message : ""
                    }
                    required
                  />
                )}
                rules={{
                  required: { message: "Product name is required" },
                  minLength: {
                    value: 3,
                    message: "Product name must be at least 3 characters long",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message:
                      "Product name must only contain letters and spaces",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Rate Your Experience</FormLabel>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => <Rating {...field} precision={0.5} />}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel>Satisfaction Level (0-100%)</FormLabel>
              <Controller
                name="satisfaction"
                control={control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    step={10}
                    tooltip
                    min={0}
                    max={100}
                    style={{ width: "80%" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Your Feedback</FormLabel>
              <Grid item xs={12}>
                <Controller
                  name="feedback"
                  label="Product feedback"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      multiline
                      rows={4}
                      error={Boolean(errors?.feedback?.message)}
                      helperText={
                        errors.feedback ? errors.feedback.message : ""
                      }
                      required
                    />
                  )}
                  rules={{
                    required: { message: "Feedback is required" },
                    minLength: {
                      value: 10,
                      message: "Feedback must be at least 10 characters long",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Would you recommend this product?</FormLabel>
              <Controller
                name="recommend"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup {...field} exclusive>
                    <ToggleButton value="yes">Yes</ToggleButton>
                    <ToggleButton value="no">No</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel>Favorite Features</FormLabel>
              <Controller
                name="features"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={[
                      "Ease of use",
                      "Performance",
                      "Value for money",
                      "Customer Support",
                    ]}
                    variant="outlined"
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <Input
                        {...params}
                        label="Select your favorite features"
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Email Address</FormLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    label="Enter your email"
                    error={Boolean(errors?.email?.message)}
                    helperText={errors.email ? errors.email.message : ""}
                    required
                  />
                )}
                rules={{
                  required: { message: "Email is required" },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="subscribe"
                    control={control}
                    render={({ field }) => {
                      const { value, ...rest } = field;
                      return <Checkbox {...rest} defaultChecked={value} />;
                    }}
                  />
                }
                label="Subscribe to our newsletter for the latest updates"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="promoOptIn"
                    control={control}
                    render={({ field }) => {
                      const { value, ...rest } = field;
                      return <Switch {...rest} defaultChecked={value} />;
                    }}
                  />
                }
                label="Receive promotional emails about similar products"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const classes = useCSSClass({
    labelColor: {
      [`&.completed, &.active`]: {
        [`& .${typographyClasses.root}`]: {
          color: "#000 !important",
        },
      },
    },
  });

  return (
    <ThemeProvider
      theme={createTheme({ palette: { secondary: { main: "#424242" } } })}
    >
      <Grid container justifyContent="center" my={5}>
        <Grid container item xs={12}>
          <Paper
            variant="outlined"
            style={{ padding: "20px", width: "800px", margin: "auto" }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stepper activeStep={activeStep} connector={<CustomConnector />}>
                {steps.map((label, index) => (
                  <Step
                    key={index}
                    completed={index < activeStep || isSubmitted}
                    StepIconComponent={CustomStepIcon}
                  >
                    <StepLabel className={classes?.labelColor}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <div style={{ marginTop: "20px" }}>
                {renderStepContent(activeStep)}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    type="button"
                    disabled={activeStep === 0 || isSubmitted}
                  >
                    Back
                  </Button>
                  {activeStep < steps.length - 1 ? (
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      variant="contained"
                      color="primary"
                      disabled={isSubmitted}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitted}
                    >
                      Submit Feedback
                    </Button>
                  )}
                </div>
              </div>
            </form>
            {submittedData && (
              <Paper
                elevation={4}
                style={{
                  padding: "30px",
                  marginTop: "30px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h6" gutterBottom color="secondary">
                  <strong>Submitted Feedback</strong>
                </Typography>
                <Divider style={{ marginBottom: "20px" }} />

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Product Name:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginLeft: "10px" }}>
                    {submittedData.productName}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Rating:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginLeft: "10px" }}>
                    {submittedData.rating} / 5
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Satisfaction Level:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginLeft: "10px" }}>
                    {submittedData.satisfaction}%
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Feedback:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginLeft: "10px" }}>
                    {submittedData.feedback}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Recommend:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginLeft: "10px" }}>
                    {submittedData.recommend}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Favorite Features:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginLeft: "10px" }}>
                    {submittedData.features.length > 0
                      ? submittedData.features.join(", ")
                      : "None"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Email:</strong>
                  </Typography>
                  <Typography variant="body2" style={{ marginLeft: "10px" }}>
                    {submittedData.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Newsletter Subscription:</strong>
                  </Typography>
                  {submittedData.subscribe ? (
                    <SvgIcon
                      ml={2}
                      icon="check_circle"
                      color="#4caf50"
                      fontSize={20}
                    />
                  ) : (
                    <SvgIcon
                      ml={2}
                      icon="close"
                      color="#f44336"
                      fontSize={20}
                    />
                  )}
                </Box>

                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" color="textSecondary">
                    <strong>Promotional Emails Opt-In:</strong>
                  </Typography>
                  {submittedData.promoOptIn ? (
                    <SvgIcon
                      ml={2}
                      icon="check_circle"
                      color="#4caf50"
                      fontSize={20}
                    />
                  ) : (
                    <SvgIcon
                      ml={2}
                      icon="close"
                      color="#f44336"
                      fontSize={20}
                    />
                  )}
                </Box>
              </Paper>
            )}
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default FeedbackForm;
