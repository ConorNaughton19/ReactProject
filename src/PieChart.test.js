import { render } from '@testing-library/react';
import PieChart from './components/PieChart';
import { AuthContext } from './AuthContext';
import { auth } from "./config/fire";


jest.mock('./useAuth', () => () => ({ currentUser: { uid: 'XwLWIV9ENgWhqP175eZBS6fHcbn2' } }));
jest.mock("./config/fire", () => ({
    __esModule: true,
    auth: jest.fn(),
  }));
  
  describe("PieChart component", () => {
    beforeEach(() => {
      auth.mockReturnValue({
        onAuthStateChanged: jest.fn(),
      });
    });
  
    it("fetches data and renders pie chart", async () => {
    });
  
  });