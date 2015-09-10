class JobsController < ApplicationController

  def index
    @current_user = User.find_by_id(session[:user_id])
    @user_id = params[:user_id]
    @personal_list = false
    if params[:search]
      @jobs = Job.search(params[:search])
    elsif params[:user_id]
      @personal_list = true
      @jobs = Job.where(user_id: params[:user_id])
    else
      @jobs = Job.where(completed: false)
    end
    render json: @jobs
  end

  def show
    @current_user = User.find_by_id(session[:user_id])
    @job = Job.find(params[:id])
    @accepted_tender = Tender.where(job_id: @job.id, accepted: true).first
    @tenders = Tender.where(job_id: @job.id, accepted: false)
    @tender_changeable = true
    if @accepted_tender
      @tender_changeable = false if @accepted_tender.updated_at > 30.seconds.ago
    end
    @job_complete = false
    if Tender.where(job_id: @job.id, rating: nil).length < Tender.where(job_id: @job.id).length
      @job_complete = true
    end
    @job_complete = false if Tender.where(job_id: @job.id).length == 0
    # render text: @tenders.length
    hash_for_job_show={job:@job,accepted_tender: @accepted_tender,tenders: @tenders,
      job_complete:@job_complete, image:@job.image.url(:medium)}
    render json: hash_for_job_show
  end

  def new
    @job = Job.new
  end

  def create
    p "angular hits this route"
    puts user_id = session[:user_id]
    if session[:user_id]
      @job = Job.create(create_job_params)
      @job.update(:user_id => user_id)
      redirect_to job_path(@job)
    else
      render text: "Please <a href='/sessions/new'>log-in</a> if you'd like to post a job"
#      render '/users/new.html.erb'
    end

  end
  def destroy
    @current_user = User.find_by_id(session[:user_id])
    job = Job.find_by_id(params[:id])
    # p @current_user
    # p params
    if @current_user && job
      if (@current_user == job.user)
        job.destroy
        flash.notice = "Job deleted"
        redirect_to user_jobs_path(@current_user)
      else
        flash.alert = "You are trying delete others job"
        redirect_to jobs_path(@current_user)
      end
    else
      flash.alert = "You should be logged in to delete jobs"
      redirect_to jobs_path
    end
  end


  private

  def create_job_params
    params.require(:job).permit(:title, :location, :description, :image)
  end

end


