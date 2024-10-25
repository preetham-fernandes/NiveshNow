"use client";
import Link from "next/link";
import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ModeToggle";
import { useState } from "react";

export default function Schedula() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [conflicts, setConflicts] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Handle file uploads
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (event.target.id === "file-upload1") {
      setFile1(uploadedFile);
    } else {
      setFile2(uploadedFile);
    }
    console.log("File uploaded:", uploadedFile); // Log file upload
  };

  // Helper function for downloading templates
  const downloadTemplate = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // File download templates
  const handleDownloadFormat1 = () => {
    const formatContent1 = `rooms\n101 : 25\n115 : 50\n200 : 250 ;\ncourses\ncs101, cs102, cs110, cs120, cs220, cs412, cs430, cs612, cs630 ;\ntimes\nMWF9, MWF10, MWF11, MWF2, TT9, TT10:30, TT2, TT3:30 ;`;
    downloadTemplate(formatContent1, "schedule_format.txt");
  };

  const handleDownloadFormat2 = () => {
    const formatContent2 = `course   enrollment   preferences\ncs101    180          MWF9, MWF10, MWF11, TT9\ncs412    80           MWF9, TT9, TT10:30\ncs612    35\ncs630    40\n`;
    downloadTemplate(formatContent2, "schedule_format_file2.txt");
  };

  // Handle form submit with file uploads
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Show loading spinner
    const formData = new FormData();
    if (file1) formData.append("file1", file1);
    if (file2) formData.append("file2", file2);

    try {
      const response = await fetch("http://localhost:5000/read_files", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong on the server.");
      }

      const result = await response.json();

      if (result.schedule) {
        setSchedule(result.schedule); // Update with schedule data
        setConflicts(null); // Clear conflicts
      } else if (result.conflicts) {
        setConflicts(result.conflicts); // Update with conflicts
        setSchedule(null); // Clear schedule
      }

      setError(null); // Clear errors after success
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting form: " + error.message);
      setSchedule(null); // Clear schedule on error
      setConflicts(null); // Clear conflicts on error
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div className="flex absolute top-0 left-0 z-10 m-4 text-White text-4xl font-bold">
            NiveshNow
          </div>
        </nav>
        <div className="flex w-full items-end justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/">
                <Button className="w-full">Logout</Button>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex min-h-[80vh] flex-1 flex-row gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {/* File 1 Upload Section */}
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">File 1 Upload</CardTitle>
            <CardDescription>Rooms, Courses, and Timing</CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">File Format:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                {`rooms\n101 : 25\n115 : 50\n200 : 250 ;\ncourses\ncs101, cs102, cs110, cs120, cs220, cs412, cs430, cs612, cs630 ;\ntimes\nMWF9, MWF10, MWF11, MWF2, TT9, TT10:30, TT2, TT3:30 ;`}
              </pre>
            </div>
            <Button variant="outline" onClick={handleDownloadFormat1}>
              Download Format Template
            </Button>
          </CardFooter>

          <CardContent>
            <form className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file-upload1">Upload File</Label>
                <Input id="file-upload1" type="file" onChange={handleFileUpload} />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* File 2 Upload Section */}
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">File 2 Upload</CardTitle>
            <CardDescription>Course Details and Preferences</CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">File Format:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                {`course   enrollment   preferences\ncs101    180          MWF9, MWF10, MWF11, TT9\ncs412    80           MWF9, TT9, TT10:30\ncs612    35\ncs630    40`}
              </pre>
            </div>
            <Button variant="outline" onClick={handleDownloadFormat2}>
              Download Format Template
            </Button>
          </CardFooter>

          <CardContent>
            <form className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file-upload2">Upload File</Label>
                <Input id="file-upload2" type="file" onChange={handleFileUpload} />
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Submit Button for Both Files */}
      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Files"}
        </Button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Schedule Display */}
      {schedule && (
        <div className="mt-6 p-4 bg-green-100">
          <h3 className="text-lg font-semibold">Generated Schedule:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(schedule, null, 2)}</pre>
        </div>
      )}

      {/* Conflict Display */}
      {conflicts && (
        <div className="mt-6 p-4 bg-red-100">
          <h3 className="text-lg font-semibold">Conflicts Detected:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(conflicts, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
