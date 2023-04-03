import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { token } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  return (
    <>
      <Header title="FAQ" />
      <Box m="20px" sx={{ mt: 6 }}>
        <Accordion defaultChecked>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.primary[900]} variant="h5">
              INFORMATION ON DIABETIC SICK DAYS...
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you have diabetes, it's crucial to know how to manage your
              health when you're feeling unwell. When you're sick, your body
              responds in ways that can impact your blood sugar levels. So, it's
              essential to be vigilant and take appropriate measures. Monitor
              your blood sugar levels more frequently and adjust your insulin or
              medication dosage if necessary. If you're unable to eat or drink
              due to nausea or vomiting, try to consume fluids to prevent
              dehydration. Opt for sugar-free drinks like water or herbal tea
              and avoid high-sugar foods that can spike your blood sugar levels.
              Stay in touch with your healthcare provider during sick days, and
              follow their recommendations for managing your diabetes during
              this time. Taking these steps can help you stay healthy and manage
              your diabetes effectively.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultChecked>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.primary[900]} variant="h5">
              REASONS TO TAKE CARE OF YOUR BLOODS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Taking care of your blood is essential for maintaining good
              health. Blood carries nutrients, oxygen, and hormones throughout
              your body, and it also removes waste products and toxins. There
              are several reasons why you should take care of your blood,
              including: Preventing disease: A healthy blood flow can prevent
              various diseases like heart disease, stroke, and diabetes.
              Boosting immunity: Your blood contains white blood cells that
              fight off infections and foreign substances. Taking care of your
              blood can help boost your immune system and prevent illness.
              Improving mental health: Good blood flow helps supply your brain
              with essential nutrients and oxygen. Taking care of your blood can
              improve your mental health and cognitive function. Enhancing
              physical performance: Healthy blood flow can improve your stamina,
              strength, and endurance during physical activities. Reducing
              stress: Poor blood circulation can lead to stress and anxiety.
              Taking care of your blood can help promote relaxation and reduce
              stress levels.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultChecked>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.primary[900]} variant="h5">
              HOW TO MANAGE YOUR DIABETES WHILE TRAVELING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Managing diabetes while traveling can be challenging, but it's
              essential to maintain good control of your blood sugar levels to
              prevent complications. Here are some tips to help you manage your
              diabetes while traveling: Pack extra medication and supplies,
              including insulin, glucose meters, test strips, and syringes, in
              case of an emergency. Research the availability of medical
              facilities and pharmacies at your destination to ensure you can
              access the necessary supplies and medical care. Plan your meals in
              advance and pack healthy snacks to avoid unhealthy food choices
              while traveling. Adjust your insulin or medication dosage as
              needed to accommodate changes in time zones and travel schedules.
              Keep your healthcare provider's contact information and any
              relevant medical records with you at all times. Be prepared for
              unexpected changes in your itinerary, such as delayed flights or
              missed meals, which can affect your blood sugar levels.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultChecked>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.primary[900]} variant="h5">
              HOW TO PREPARE FOR A DIABETIC EMERGENCY
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              As a diabetic, it's essential to prepare for a potential
              emergency, such as a sudden drop in blood sugar levels or diabetic
              ketoacidosis. Here are some tips to help you prepare for a
              diabetic emergency: Keep glucose tablets, candy, or juice on hand
              in case of a sudden drop in blood sugar levels. Wear a medical
              alert bracelet or necklace to alert others that you have diabetes
              in case of an emergency. Have a glucagon injection kit readily
              available for severe hypoglycemia. Make sure your family members,
              coworkers, or friends know how to recognize the symptoms of a
              diabetic emergency and how to respond. Keep your healthcare
              provider's contact information and any relevant medical records
              with you at all times.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultChecked>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.primary[900]} variant="h5">
              WHAT IS HbA1c AND WHY IS IT IMPORTANT FOR DIABETICS?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              HbA1c, also known as glycated hemoglobin, is a measure of the
              average blood sugar levels over the past two to three months. It's
              an important indicator of diabetes management and control. By
              monitoring your HbA1c levels, you can assess how well you are
              managing your diabetes over time. A high HbA1c level indicates
              that your blood sugar levels have been consistently high,
              increasing the risk of diabetes-related complications, such as
              nerve damage, kidney disease, and vision problems. Conversely, a
              low HbA1c level suggests that your blood sugar levels have been
              well-managed, reducing the risk of complications. It's essential
              for people with diabetes to have their HbA1c levels checked
              regularly, as recommended by their healthcare provider, to ensure
              they're maintaining good blood sugar control and adjust their
              diabetes management plan as needed.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultChecked>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.primary[900]} variant="h5">
              Signs of a Hypo or Hyper for a Diabetic
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <ul>
                <li>Symptoms of hypoglycemia (low blood sugar) include:</li>
                <ul>
                  <li>Sweating</li>
                  <li>Shakiness</li>
                  <li>Dizziness or lightheadedness</li>
                  <li>Hunger</li>
                  <li>Headache</li>
                  <li>Irritability or mood changes</li>
                  <li>Fatigue or weakness</li>
                  <li>Blurred vision</li>
                  <li>Fainting or loss of consciousness (in severe cases)</li>
                </ul>
                <li>Symptoms of hyperglycemia (high blood sugar) include:</li>
                <ul>
                  <li>Frequent urination</li>
                  <li>Increased thirst</li>
                  <li>Blurred vision</li>
                  <li>Headache</li>
                  <li>Fatigue or weakness</li>
                  <li>Slow healing of cuts or wounds</li>
                  <li>Irritability or mood changes</li>
                  <li>Nausea or vomiting (in severe cases)</li>
                  <li>
                    Fruity-smelling breath (in cases of diabetic ketoacidosis)
                  </li>
                </ul>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};

export default FAQ;
