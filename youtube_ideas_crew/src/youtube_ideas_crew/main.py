#!/usr/bin/env python
import sys
import warnings
import json

from youtube_ideas_crew.crew import YoutubeIdeaGeneratorCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew.
    """
    inputs = {
        "comments": '[{"title": "Stack and Heap memory in javascript","comment_text": "Sirji, can you please suggest best font for VS Code..?","video_id": "XVEFVHi0aH0","id": "a1b24aad-c82a-48e7-bdf5-fcc0c8c7b1df"}, {"title": "Stack and Heap memory in javascript","comment_text": "Shades of purple 💜","video_id": "XVEFVHi0aH0","id": "41b23834-e20f-498b-948f-73a98c0d7725"}, {"title": "Stack and Heap memory in javascript","comment_text": "Monokai one pro dark theme mode","video_id": "XVEFVHi0aH0","id": "f7a1ec35-919e-41bb-9276-d5b77a380055"}, {"title": "Stack and Heap memory in javascript","comment_text": "GitHub theme ❤️❤️❤️","video_id": "XVEFVHi0aH0","id": "a821f5bd-b2dd-48fb-add7-be87d064aa93"}, {"title": "Stack and Heap memory in javascript","comment_text": "Github dark &amp; Github light ❤","video_id": "XVEFVHi0aH0","id": "cf8b8019-b1b0-4386-9fd2-54205ef21f1a"}]'
    }
    YoutubeIdeaGeneratorCrew().crew().kickoff(inputs=inputs)


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        YoutubeIdeaGeneratorCrew().crew().train(n_iterations=int(
            sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")


def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        YoutubeIdeaGeneratorCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        YoutubeIdeaGeneratorCrew().crew().test(n_iterations=int(
            sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
