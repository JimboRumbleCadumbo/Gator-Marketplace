"""
    This test is to check if the server is under attack.
    Command to run the test: 
        locust -f user_breach_test.py --headless -u 1000 -r 60 --host http://localhost:5000
    Meaning: to run 1000 users with 60 requests per minute
"""
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    # no wait time so users hammer simultaneously
    wait_time = between(0, 0)

    @task
    def slow(self):
        self.client.get("/?sleep=30", name="/?sleep=30")  # and in your handler you do time.sleep(request.args.get('sleep'))

    def hit_root(self):
        with self.client.get("/", catch_response=True) as resp:
            # we expect either 200 (under limit) or 503 (over limit)
            if resp.status_code == 503:
                # you can inspect body to ensure it's your traffic message
                if "huge internet traffic" not in resp.text:
                    resp.failure(f"503 but wrong body: {resp.text[:50]!r}")
                else:
                    resp.success()
            elif resp.status_code != 200:
                resp.failure(f"Unexpected status code: {resp.status_code}")