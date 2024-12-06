import { Article, Email, LinkedIn, Terminal, X } from "@mui/icons-material";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { type ReactElement } from "react";

const generateTimelineItems = () => {
  const topics = [
    "React",
    "TypeScript",
    "State Management",
    "Testing",
    "Performance",
    "Security",
    "Design Patterns",
    "Architecture",
    "CI/CD",
    "DevOps",
  ];

  const articlePrefixes = [
    "Guide to",
    "Understanding",
    "Deep Dive into",
    "Best Practices for",
    "Advanced",
  ];

  const projectPrefixes = [
    "Building",
    "Developing",
    "Creating",
    "Implementing",
    "Optimizing",
  ];

  const items = [];
  const startDate = new Date(2024, 0, 1); // Start from January 1, 2024

  for (let i = 0; i < 50; i++) {
    const isArticle = Math.random() > 0.3; // 70% chance of being an article
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const prefix = isArticle
      ? articlePrefixes[Math.floor(Math.random() * articlePrefixes.length)]
      : projectPrefixes[Math.floor(Math.random() * projectPrefixes.length)];

    const itemDate = new Date(startDate);
    itemDate.setDate(startDate.getDate() - i * 3); // Each item is 3 days apart

    items.push({
      date: itemDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      title: `${prefix} ${topic}`,
      description: isArticle
        ? `A comprehensive exploration of ${topic.toLowerCase()} concepts and techniques in modern web development.`
        : `A practical implementation showcasing ${topic.toLowerCase()} principles in action.`,
      type: isArticle ? ("article" as const) : ("project" as const),
    });
  }

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

const timelineItems = generateTimelineItems();

export function App(): ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "grey.50",
          borderBottom: 1,
          borderColor: "grey.200",
        }}
      >
        <Toolbar sx={{ py: 2 }}>
          <div>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                letterSpacing: -0.5,
              }}
            >
              Konrad Zagozda
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                letterSpacing: 0.2,
                mt: 0.5,
              }}
            >
              archive
            </Typography>
          </div>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            href="mailto:zagozdakonrad@gmail.com"
            size="large"
            sx={{
              ml: 1,
              color: "grey.700",
              "&:hover": {
                color: "primary.main",
                bgcolor: "grey.100",
              },
            }}
            aria-label="Email"
          >
            <Email />
          </IconButton>
          <IconButton
            href="https://x.com/konrad_zagozda"
            target="_blank"
            rel="noreferrer"
            size="large"
            sx={{
              ml: 1,
              color: "grey.700",
              "&:hover": {
                color: "primary.main",
                bgcolor: "grey.100",
              },
            }}
            aria-label="X profile"
          >
            <X />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/zagozda/"
            target="_blank"
            rel="noreferrer"
            size="large"
            sx={{
              ml: 1,
              color: "grey.700",
              "&:hover": {
                color: "primary.main",
                bgcolor: "grey.100",
              },
            }}
            aria-label="LinkedIn profile"
          >
            <LinkedIn />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Timeline
        position={isMobile ? "right" : "alternate"}
        sx={{
          [`& .MuiTimelineItem-root`]: {
            ...(isMobile && {
              flexDirection: "row !important",
              "&:before": {
                display: "none",
              },
            }),
            "&.MuiTimelineItem-alternateContent": {
              "& .MuiTimelineContent-root": {
                textAlign: "left",
              },
            },
          },
          [`& .MuiTimelineOppositeContent-root`]: {
            ...(isMobile && {
              flex: "0 0 90px",
              position: "relative",
              right: "16px",
              textAlign: "left",
            }),
            textAlign: isMobile ? "left" : "right",
          },
        }}
      >
        {timelineItems.map((item) => (
          <TimelineItem key={item.title}>
            <TimelineOppositeContent
              sx={{
                m: "auto 0",
              }}
              variant="body2"
              color="text.secondary"
            >
              {item.date}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot
                color={item.type === "article" ? "primary" : "secondary"}
              >
                {item.type === "article" ? <Article /> : <Terminal />}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6" component="span">
                {item.title}
              </Typography>
              <Typography>{item.description}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
}
