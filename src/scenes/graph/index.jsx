import GraphPage from '../../components/Graph';
import { Box } from "@mui/material";
import Header from "../../components/Header";

const Graph = () => {
    return (
      <Box m="20px">
        <Header title="Machine Learning Graph" subtitle="Linear Regression Model of Values" />
        <Box height="80vh">
          <GraphPage />
        </Box>
      </Box>
    );
    }
export default Graph;
