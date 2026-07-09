import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

describe("Futuristic UI Base Components", () => {
  
  describe("Button Component", () => {
    it("should render button children text correctly", () => {
      render(<Button>Start Learning</Button>);
      expect(screen.getByRole("button", { name: /start learning/i })).toBeInTheDocument();
    });

    it("should trigger click handlers when clicked", () => {
      const clickMock = jest.fn();
      render(<Button onClick={clickMock}>Click Me</Button>);
      
      fireEvent.click(screen.getByRole("button", { name: /click me/i }));
      expect(clickMock).toHaveBeenCalledTimes(1);
    });

    it("should show spin indicator and disable click events during loading states", () => {
      const clickMock = jest.fn();
      render(<Button isLoading onClick={clickMock}>Loading Action</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      
      // Try to click
      fireEvent.click(button);
      expect(clickMock).not.toHaveBeenCalled();
    });
  });

  describe("Input Component", () => {
    it("should render custom placeholder text", () => {
      render(<Input placeholder="Search subject..." />);
      expect(screen.getByPlaceholderText("Search subject...")).toBeInTheDocument();
    });

    it("should render error texts and styling fields when provided", () => {
      render(<Input placeholder="Email" error="Invalid email address" />);
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  describe("Label Component", () => {
    it("should render label text content and apply class modifiers", () => {
      render(<Label className="custom-class">Target Subject</Label>);
      const label = screen.getByText("Target Subject");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("custom-class");
    });
  });

  describe("Card Component", () => {
    it("should render nested visual headers, titles, and children sections", () => {
      render(
        <Card hoverEffect>
          <CardHeader>
            <CardTitle>Streak Standing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You studied 12 days in a row.</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("Streak Standing")).toBeInTheDocument();
      expect(screen.getByText("You studied 12 days in a row.")).toBeInTheDocument();
    });
  });

  describe("Badge Component", () => {
    it("should render correct badge variants", () => {
      render(<Badge variant="success">Completed</Badge>);
      const badge = screen.getByText("Completed");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("bg-emerald-950/40");
    });
  });
});
