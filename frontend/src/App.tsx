import { Document } from "@contentful/rich-text-types";
import { Box, Container, Typography } from "@mui/material";
import { Entry, EntrySkeletonType } from "contentful";
import { useEffect, useState, type ReactElement } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Article } from "./components/Article";
import { Header } from "./components/Header";
import { PoweredBy } from "./components/PoweredBy";
import { Timeline } from "./components/Timeline";
import { getBlogEntries } from "./utils/contentful";
import { slugify } from "./utils/slugify";

// Common properties for all timeline items
interface BaseTimelineItem {
  date: string;
  title: string;
  type: "article" | "project" | "celebration";
}

// Article specific properties
export interface ArticleItem extends BaseTimelineItem {
  type: "article";
  description: string;
  content: Document | string;
}

// Project specific properties
interface ProjectItem extends BaseTimelineItem {
  type: "project";
  description: string;
  link: string;
}

// Celebration specific properties
interface CelebrationItem extends BaseTimelineItem {
  type: "celebration";
}

// Union type for all possible timeline items
type TimelineItem = ArticleItem | ProjectItem | CelebrationItem;

// Add these type definitions at the top with your other interfaces
interface BlogEntry extends EntrySkeletonType {
  fields: {
    date: string;
    title: string;
    type: "article" | "project" | "celebration";
    description?: string;
    content?: Document | string;
    link?: string;
  };
}

function ArticleRoute({ items }: { items: TimelineItem[] }) {
  const { id } = useParams();

  const article = items.find(
    (item) => item.type === "article" && slugify(item.title) === id
  );

  if (!article || article.type !== "article") {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4">Article not found</Typography>
      </Container>
    );
  }

  return <Article article={article} />;
}

function AnimatedRoutes({ items }: { items: TimelineItem[] }) {
  const location = useLocation();
  const isArticlePage = location.pathname.startsWith("/article");

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        timeout={600}
        classNames={isArticlePage ? "slide-left" : "slide-right"}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            perspective: "2500px",
            transformStyle: "preserve-3d",
          }}
        >
          <Routes location={location}>
            <Route path="/" element={<Timeline items={items} />} />
            <Route
              path="/article/:id"
              element={<ArticleRoute items={items} />}
            />
          </Routes>
        </Box>
      </CSSTransition>
    </TransitionGroup>
  );
}

export function App(): ReactElement {
  const [items, setItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    getBlogEntries()
      .then((response) => {
        const transformedItems = response.items.map(
          (entry: Entry<BlogEntry>) => {
            const date = new Date(entry.fields.date as unknown as string).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );

            return {
              date,
              title: entry.fields.title as unknown as string,
              type: entry.fields.type as unknown as "article" | "project" | "celebration",
              ...(entry.fields.description && {
                description: entry.fields.description as unknown as string,
              }),
              ...(entry.fields.content && { 
                content: entry.fields.content as unknown as (Document | string)
              }),
              ...(entry.fields.link && { 
                link: entry.fields.link as unknown as string 
              }),
            } as TimelineItem;
          }
        );
        setItems(transformedItems);
      })
      .catch((error) => console.error("Error fetching blog entries:", error));
  }, []);

  return (
    <BrowserRouter>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          margin: 0,
          padding: 0,
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            position: "relative",
          }}
        >
          <AnimatedRoutes items={items} />
        </Box>
        <PoweredBy />
      </Box>
    </BrowserRouter>
  );
}
