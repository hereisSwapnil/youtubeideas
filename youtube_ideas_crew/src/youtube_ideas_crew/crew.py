from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task, before_kickoff, after_kickoff
from pydantic import BaseModel
from typing import List
from src.youtube_ideas_crew.tools.SearchYoutubeTool import YoutubeVideoSearchAndDetailsTool


class ResearchItem(BaseModel):
    title: str
    url: str
    view_count: int


class VideoIdea(BaseModel):
    score: int
    video_title: str
    description: str
    video_id: str
    comment_id: str
    research: List[ResearchItem]


class VideoIdeasList(BaseModel):
    video_ideas: List[VideoIdea]


@CrewBase
class YoutubeIdeaGeneratorCrew:
    """YoutubeIdeaGeneratorCrew"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    # @before_kickoff  # Optional hook to be executed before the crew starts
    # def pull_data_example(self, inputs):
    # 	# Example of pulling data from an external API, dynamically changing the inputs
    # 	return inputs

    @after_kickoff  # Optional hook to be executed after the crew has finished
    def log_results(self, output):
        # Example of logging results, dynamically changing the output
        print(f"Results: {output}")
        return output

    @agent
    def comment_filter_agent(self) -> Agent:
        return Agent(config=self.agents_config["comment_filter_agent"], verbose=True)

    @agent
    def video_idea_generator_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["video_idea_generator_agent"], verbose=True
        )

    @agent
    def research_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["research_agent"],
            tools=[YoutubeVideoSearchAndDetailsTool()],
            verbose=True,
        )

    @agent
    def scoring_agent(self) -> Agent:
        return Agent(config=self.agents_config["scoring_agent"], verbose=True)

    @task
    def filter_comments_task(self) -> Task:
        return Task(
            config=self.tasks_config["filter_comments_task"],
        )

    @task
    def generate_video_ideas_task(self) -> Task:
        return Task(
            config=self.tasks_config["generate_video_ideas_task"],
        )

    @task
    def research_video_ideas_task(self) -> Task:
        return Task(
            config=self.tasks_config["research_video_ideas_task"],
        )

    @task
    def score_video_ideas_task(self) -> Task:
        return Task(
            config=self.tasks_config["score_video_ideas_task"],
            output_pydantic=VideoIdeasList,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the YoutubeIdeaGenerator crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
